import { Outlet, createRootRoute } from '@tanstack/react-router';
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
// import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
// import { TanStackDevtools } from '@tanstack/react-devtools';
import Header from '@/components/Header';
import GlobalDialog from '@/components/dialogs/GlobalDialog';
import { Toaster } from 'sonner';

export const Route = createRootRoute({
  pendingComponent: () => (
    <div className="h-dvh w-dvw grid place-content-center">
      <img src="logo512.png" alt="Food Tracker" className="h-8 animate-pulse" />
    </div>
  ),
  component: () => (
    <>
      <Header />
      <Outlet />
      <GlobalDialog />
      <Toaster position="top-center" duration={2000} richColors />
      {/* <TanStackDevtools
        config={{
          triggerHidden: true,
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: 'Tanstack Query',
            render: <ReactQueryDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  ),
});
