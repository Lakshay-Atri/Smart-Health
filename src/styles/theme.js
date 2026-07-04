export const theme = {
  colors: {
    primary: {
      light: '#e9ecf5',
      main: '#6366f1', // sleek Indigo
      hover: '#4f46e5',
      dark: '#312e81',
    },
    status: {
      green: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        hex: '#10b981',
      },
      yellow: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        border: 'border-amber-200',
        hex: '#f59e0b',
      },
      red: {
        bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
        dot: 'bg-rose-500',
        text: 'text-rose-700',
        border: 'border-rose-200',
        hex: '#ef4444',
      }
    }
  },
  card: {
    base: 'bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-300',
    interactive: 'hover:shadow-md hover:border-slate-200/80 hover:-translate-y-0.5 cursor-pointer',
    title: 'text-sm font-semibold text-slate-500 tracking-wide uppercase',
  }
};

export default theme;
