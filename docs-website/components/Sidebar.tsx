'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Database, Code } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      title: 'Getting Started',
      icon: Book,
      items: [
        { title: 'Introduction', href: '/docs/getting-started' },
        { title: 'Installation', href: '/docs/installation' },
        { title: 'Quick Start', href: '/docs/quick-start' },
      ],
    },
    {
      title: 'Core Concepts',
      icon: Database,
      items: [
        { title: 'Models & Decorators', href: '/docs/models' },
        { title: 'Connections', href: '/docs/connections' },
        { title: 'Query Builder', href: '/docs/query-builder' },
        { title: 'Transactions', href: '/docs/transactions' },
      ],
    },
    {
      title: 'Examples',
      icon: Code,
      items: [
        { title: 'Code Examples', href: '/docs/examples' },
      ],
    },
  ];

  return (
    <aside className="hidden lg:block w-64 xl:w-72 fixed left-0 top-16 bottom-0 overflow-y-auto bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-30">
      <nav className="p-6 space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <div className="flex items-center space-x-2 mb-3 px-2">
              <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                {section.title}
              </h3>
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname === item.href + '/';
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Quick Links */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a
              href="https://github.com/yourusername/typescript-orm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub Repository →
            </a>
          </li>
          <li>
            <a
              href="https://github.com/yourusername/typescript-orm/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Report an Issue →
            </a>
          </li>
          <li>
            <a
              href="https://github.com/yourusername/typescript-orm/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Discussions →
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
