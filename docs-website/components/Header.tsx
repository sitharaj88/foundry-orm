'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Github, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsMenuOpen, setDocsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <nav className="mx-auto flex max-w-full items-center justify-between p-4 px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">FO</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              FoundryORM
            </span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          <Link
            href="/"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/docs/getting-started"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/docs/examples"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Examples
          </Link>
          <a
            href="https://github.com/yourusername/foundry-orm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Documentation section with submenu */}
            <div>
              <button
                onClick={() => setDocsMenuOpen(!docsMenuOpen)}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span>Documentation</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${docsMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {docsMenuOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    href="/docs/getting-started"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDocsMenuOpen(false);
                    }}
                  >
                    Getting Started
                  </Link>
                  <Link
                    href="/docs/installation"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDocsMenuOpen(false);
                    }}
                  >
                    Installation
                  </Link>
                  <Link
                    href="/docs/quick-start"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDocsMenuOpen(false);
                    }}
                  >
                    Quick Start
                  </Link>
                  <Link
                    href="/docs/models"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDocsMenuOpen(false);
                    }}
                  >
                    Models & Decorators
                  </Link>
                  <Link
                    href="/docs/connections"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDocsMenuOpen(false);
                    }}
                  >
                    Connections
                  </Link>
                  <Link
                    href="/docs/query-builder"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDocsMenuOpen(false);
                    }}
                  >
                    Query Builder
                  </Link>
                  <Link
                    href="/docs/transactions"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDocsMenuOpen(false);
                    }}
                  >
                    Transactions
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/docs/examples"
              className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Examples
            </Link>
            
            <a
              href="https://github.com/yourusername/foundry-orm"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
