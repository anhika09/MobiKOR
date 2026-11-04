tailwind.config = {
  darkMode: ['class', '[data-theme="dark"]'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        page: 'rgb(var(--c-page) / <alpha-value>)',
        section: 'rgb(var(--c-section) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--c-surface-raised) / <alpha-value>)',
        border: 'rgb(var(--c-border) / <alpha-value>)',
        text: 'rgb(var(--c-text) / <alpha-value>)',
        'text-muted': 'rgb(var(--c-text-muted) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--c-accent-hover) / <alpha-value>)',
        'accent-text': 'rgb(var(--c-accent-text) / <alpha-value>)',
        'on-accent': 'rgb(var(--c-on-accent) / <alpha-value>)',
        outline: 'rgb(var(--c-outline) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
        link: 'rgb(var(--c-link) / <alpha-value>)',
        header: 'rgb(var(--c-header) / <alpha-value>)',
        'text-header': 'rgb(var(--c-text-header) / <alpha-value>)',
        'step-surface': 'rgb(var(--c-step-surface) / <alpha-value>)',
        'step-text': 'rgb(var(--c-step-text) / <alpha-value>)',
        'step-text-muted': 'rgb(var(--c-step-text-muted) / <alpha-value>)',
        'step-border': 'rgb(var(--c-step-border) / <alpha-value>)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
      },
      fontSize: {
        display: ['clamp(2rem, 5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h1: ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.15' }],
        h2: ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.2' }],
        h3: ['1.125rem', { lineHeight: '1.35' }],
      },
    },
  },
};
