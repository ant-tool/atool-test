describe('global check', function() {
  it('should have expect && TestUtils', function () {
    expect(expect).not.to.be.null;
    expect(sinon).not.to.be.null;
  });
});