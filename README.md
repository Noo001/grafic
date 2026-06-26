# Metrics Chart

Комбинированный интерактивный график для визуализации 4 time-series последовательностей:

- `area` — жёлтая область (Cost)
- `bar` — синие столбцы (CPA)
- `spline` — зелёная сглаженная линия (ROI confirmed)
- `line` — фиолетовая линия с квадратными маркерами (Conversions)

При наведении показывается кастомный тултип с датой и всеми четырьмя метриками, как на референсном скриншоте.

## Стек

- React 19 + TypeScript
- Vite 6
- ApexCharts (react-apexcharts)

## Быстрый старт

```bash
# 1. Клонируйте репозиторий
git clone <ссылка-на-репо>.git
cd grafic

# 2. Установите зависимости
npm install

# 3. Запустите dev-сервер
npm run dev
```

Откройте в браузере `http://localhost:5173`.

## Сборка

```bash
npm run build
```

Статика появится в папке `dist`.

## Как инициализировать график с четырьмя последовательностями

Главный компонент — `MetricsChart`. Он принимает массив `MetricSeries`:

```tsx
import { MetricsChart } from './components/MetricsChart';
import type { MetricSeries } from './data';

const series: MetricSeries[] = [
  {
    name: 'Cost',
    type: 'area',
    color: '#FDE68A',
    data: [
      { date: '13.06.2026', value: 55.65 },
      { date: '14.06.2026', value: 62.10 },
      // ...
    ],
  },
  {
    name: 'CPA',
    type: 'bar',
    color: '#3B82F6',
    data: [
      { date: '13.06.2026', value: 0.79 },
      // ...
    ],
  },
  {
    name: 'ROI confirmed',
    type: 'spline',
    color: '#22C55E',
    data: [
      { date: '13.06.2026', value: 56.33 },
      // ...
    ],
  },
  {
    name: 'Conversions',
    type: 'line',
    color: '#A855F7',
    data: [
      { date: '13.06.2026', value: 70 },
      // ...
    ],
  },
];

function App() {
  return <MetricsChart series={series} height={420} />;
}
```

### Правила данных

1. Все четыре серии должны иметь одинаковый набор дат в одинаковом порядке.
2. Поле `date` — строка в любом формате (в тултипе отображается как есть).
3. Поле `value` — число.
4. Поддерживаемые `type`: `'area' | 'spline' | 'line' | 'bar'`.

### Генерация тестовых данных

В проекте есть `generateSampleData()` в `src/data.ts` — она использует 5 дней из референсной гифки (10.06.2026 – 14.06.2026). Вы можете заменить её на свои реальные данные.

## Структура проекта

```
src/
  components/
    MetricsChart.tsx   # компонент графика
  data.ts              # типы и генератор сэмпл-данных
  App.tsx              # демо-приложение
  index.css            # стили карточки и тултипа
```

## Кастомизация

- Цвета серий задаются через поле `color` в `MetricSeries`.
- Размер графика — проп `height`.
- Стили карточки и тултипа — `src/index.css`.
- Тип линии (`spline` vs обычная `line`) настраивается внутри `MetricsChart` через `stroke.curve`.
- По умолчанию `Cost` и `CPA` рисуются на одной долларовой шкале (CPA-столбцы остаются маленькими у оси), а `ROI confirmed` и `Conversions` — на собственных шкалах. Это поведение можно изменить в `MetricsChart` в блоке `normalized`.

## Публикация на GitHub Pages (автоматически через GitHub Actions)

1. Создай репозиторий на GitHub и запушь код:

```bash
git remote add origin https://github.com/ТВОЙ_НИК/grafic.git
git branch -M main
git push -u origin main
```

2. В настройках репозитория (`Settings → Pages`) выбери **Source: GitHub Actions**.

3. При следующем пуше в `main` запустится workflow `.github/workflows/deploy.yml` и опубликует сайт по адресу:

```
https://ТВОЙ_НИК.github.io/grafic/
```

> Если имя репозитория не `grafic`, поменяй `base: '/grafic/'` в `vite.config.ts` на `base: '/ИМЯ_РЕПО/'`.

## Ручная публикация

```bash
npm run build
# затем размести содержимое папки dist на GitHub Pages / Netlify / Vercel
```
