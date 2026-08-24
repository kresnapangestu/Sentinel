require("@testing-library/jest-dom");

// ECharts needs a real canvas + ResizeObserver; jsdom has neither. The chart
// component is not under test here -- its *options* are (pure functions), so a
// stub keeps rendering tests from crashing on an unrelated dependency.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
