export default function Loader({ fullScreen = false }) {
  const loaderUi = (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {loaderUi}
      </div>
    );
  }

  return loaderUi;
}
