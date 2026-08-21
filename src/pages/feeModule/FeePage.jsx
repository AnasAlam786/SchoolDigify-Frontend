import FeeDrawer from './components/feeDrawer/FeeDrawer';

function FeePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <FeeDrawer
        open={true}
        onClose={() => undefined}
        openByDefault={true}
        title="Fee Drawer"
      />
    </div>
  );
}

export default FeePage;
