import { Card, Typography } from "@material-tailwind/react";

export default function PreferencesSection() {
  return (
    <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-white font-semibold">
        Preferințe
      </Typography>
      <div className="text-sm text-gray-400">
        Mod de transport: <span className="text-white font-medium">Tramvai</span><br />
        Rute frecventate: <span className="text-white font-medium">9, 41</span>
      </div>
    </Card>
  );
}
