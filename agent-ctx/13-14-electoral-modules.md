# Task 13-14: Reportes & Configuración Modules

## Work Summary

Built two comprehensive electoral administration modules with orange (#FF6B00) primary color theme:

### File 1: `/home/z/my-project/src/components/electoral/Reportes.tsx`
- **Resumen General tab**: 4 stats cards (Total votos, Total actas, Actas validadas, Actas pendientes) + full summary table with party rankings and progress bars
- **Por Partido tab**: Horizontal bar chart using ChartContainer + recharts + detailed party cards with vote breakdown by department
- **Por Ubicación tab**: Stacked bar chart by department + departamento filter via Select + table showing votes per department per party
- **Actas tab**: Donut chart (PieChart) for validation status distribution + progress bars per status + table of actas with issues

### File 2: `/home/z/my-project/src/components/electoral/Configuracion.tsx`
- **Perfil del Administrador**: Avatar with initials, name/email/password fields, edit toggle
- **Configuración de Elecciones**: Process name, date, start/end time, process status Select
- **Notificaciones**: 3 toggle switches with descriptions (Switch component)
- **Seguridad**: Force password change toggle, session timeout Select, 2FA toggle
- Save button with alert feedback

### File 3: `/home/z/my-project/src/app/page.tsx`
- Full electoral admin layout with dark sidebar navigation
- Mobile-responsive with hamburger menu
- Breadcrumb in top bar
- Renders Reportes and Configuracion modules based on nav selection

## Technical Details
- All components use 'use client' directive
- Orange (#FF6B00) theme applied consistently
- Responsive design with mobile-first approach
- Uses shadcn/ui components (Card, Tabs, Table, Badge, Select, Switch, Avatar, etc.)
- Uses ChartContainer from @/components/ui/chart for all charts
- Uses recharts (BarChart, PieChart, Pie, Cell, etc.) for visualizations
- Lint passes with no errors
- Dev server compiles successfully
