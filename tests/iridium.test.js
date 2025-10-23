const fs = require('fs');
const nock = require('nock');
const utils = require('../src/utils');
const { getTable } = require('../src/iridium');

jest.mock('fs'); // mock filesystem operations
jest.mock('../src/utils'); // mock your utils functions

describe('getTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call utils.get_options and fs.mkdir if counter is 0', async () => {
    // Mock utils functions
    utils.get_options.mockReturnValue({ url: 'http://mocked-url.com' });
    utils.post_options.mockReturnValue({ url: 'http://mocked-url.com' });
    utils.iridium_options.mockReturnValue({ url: 'http://mocked-url.com' });
    utils.md5.mockReturnValue('mocked-id');

    // Mock fs functions
    fs.existsSync.mockReturnValue(false);
    fs.mkdir.mockImplementation((path, cb) => cb(null));
    fs.appendFile.mockImplementation((path, data, cb) => cb(null));

    // Mock HTTP request using nock
    nock('http://mocked-url.com')
      .get('/')
      .reply(200, '<html><form><table class="standardTable"><tbody></tbody></table></form></html>');

    // Call the function
    getTable({ root: './', counter: 0, database: [], pages: 0 });

    // Assertions
    expect(utils.get_options).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith('./IridiumFlares/');
    expect(fs.mkdir).toHaveBeenCalled();
  });
});

