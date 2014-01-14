describe('Beat', function(){
  var nagBeat, $timeout;

  beforeEach(module('app'));

  beforeEach(inject(function($injector) {
    //nagBeat = $injector.get('nagBeat');
    //$timeout = $injector.get('$timeout');
  }));

  it('should be true', function() {
    expect(true).toEqual(true);
  });
});