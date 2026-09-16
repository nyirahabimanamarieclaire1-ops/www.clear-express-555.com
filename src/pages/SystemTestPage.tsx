import React, { useState, useEffect } from 'react';
import { runAllLogisticsTests, TestResult } from '../../tests/logistics.test.ts';
import { CheckCircle2, XCircle, Play, Shield, RefreshCw } from 'lucide-react';

export const SystemTestPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const executeTests = async () => {
    setIsRunning(true);
    try {
      const results = await runAllLogisticsTests();
      setTests(results);
    } catch (err) {
      console.error('Error running test suite:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executeTests();
  }, []);

  const totalCount = tests.length;
  const passedCount = tests.filter((t) => t.passed).length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#0047AB]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                System Verification Suite
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] mt-1">
              Clear Express 555 Specification Tests (Section 37)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Validating road route geometry, dynamic pricing formula, tracking sequence, and proof of delivery.
            </p>
          </div>

          <button
            type="button"
            onClick={executeTests}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Tests...' : 'Re-Run All Tests'}</span>
          </button>
        </div>

        {/* Scorecard Banner */}
        <div
          className={`p-6 rounded-2xl border-2 flex items-center justify-between ${
            allPassed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl ${
                allPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {allPassed ? '✓' : '!'}
            </div>
            <div>
              <div className="font-black text-lg">
                {allPassed ? 'All Specification Tests Passed (100%)' : 'Tests Executed'}
              </div>
              <div className="text-xs opacity-90">
                {passedCount} of {totalCount} test assertions verified against prompt specification.
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black font-mono">
              {passedCount} / {totalCount}
            </span>
          </div>
        </div>

        {/* Test Cases Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 text-xs">
          {tests.map((t, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {t.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0A2540]">{t.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                      {t.category}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="text-slate-400">Expected: </span>
                    <span className="font-semibold">{t.expected}</span>
                  </div>
                  <div className="text-slate-700">
                    <span className="text-slate-400">Actual: </span>
                    <span className="font-mono text-slate-800">{t.actual}</span>
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                  t.passed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {t.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
