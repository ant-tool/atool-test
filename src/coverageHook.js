import fs from 'fs';

export default {
  afterEnd(reporter) {
    const coverage = reporter.page.evaluate(() => window.__coverage__);
    if (coverage) {
      fs.write('coverage/coverage.json', JSON.stringify(coverage), 'w');
    }
  },
};
