import { RiddlerExplorer } from '../services/RiddlerExplorer';

describe('RiddlerExplorer', () => {
  let riddler: RiddlerExplorer;

  beforeEach(() => {
    riddler = new RiddlerExplorer();
  });

  test('should initialize with default state', () => {
    const state = riddler.getState();
    expect(state.complexity).toBe(0);
    expect(state.count).toBe(0);
    expect(state.lastRiddle).toBe('');
  });

  test('should generate riddles with increasing complexity', () => {
    const riddle1 = riddler.generateRiddle();
    expect(riddle1).toContain("What has keys but can't open locks?");

    const riddle2 = riddler.generateRiddle();
    expect(riddle2).toContain("What can travel around the world while staying in the corner?");

    const state = riddler.getState();
    expect(state.complexity).toBe(2);
    expect(state.count).toBe(2);
  });

  test('should emit events when generating riddles', (done) => {
    riddler.on('newRiddle', (data) => {
      expect(data.riddle).toBeDefined();
      expect(data.state).toBeDefined();
      expect(data.state.complexity).toBe(1);
      done();
    });

    riddler.generateRiddle();
  });

  test('should process riddles and emit solved event', (done) => {
    riddler.on('solved', (data) => {
      expect(data.riddle).toBe("What has keys but can't open locks?");
      expect(data.answer).toBe("A piano");
      expect(data.state).toBeDefined();
      done();
    });

    const riddle = riddler.generateRiddle();
    riddler.processRiddle(riddle);
  });

  test('should emit unsolved event for unknown riddles', (done) => {
    riddler.on('unsolved', (data) => {
      expect(data.riddle).toBe("Unknown riddle");
      expect(data.state).toBeDefined();
      done();
    });

    riddler.processRiddle("Unknown riddle");
  });

  test('should reset state when reset is called', () => {
    riddler.generateRiddle();
    riddler.generateRiddle();
    
    riddler.reset();
    
    const state = riddler.getState();
    expect(state.complexity).toBe(0);
    expect(state.count).toBe(0);
    expect(state.lastRiddle).toBe('');
  });

  test('should emit reset event when reset is called', (done) => {
    riddler.on('reset', (state) => {
      expect(state.complexity).toBe(0);
      expect(state.count).toBe(0);
      done();
    });

    riddler.reset();
  });

  test('should start riddle battle and process riddles', () => {
    const solvedSpy = jest.fn();
    const unsolvedSpy = jest.fn();

    riddler.on('solved', solvedSpy);
    riddler.on('unsolved', unsolvedSpy);

    riddler.startRiddleBattle();

    // At least one event should be emitted
    expect(solvedSpy.mock.calls.length + unsolvedSpy.mock.calls.length).toBeGreaterThan(0);
  });
}); 