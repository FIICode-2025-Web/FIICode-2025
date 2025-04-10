import { Card, Typography } from "@material-tailwind/react";

export default function ReportsSection() {
  return (
    <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-white font-semibold">
        Rapoarte
      </Typography>
      <div className="text-sm text-gray-400">
        You have submitted <span className="text-white font-medium">3 reports</span> this month.
      </div>
    </Card>
  );
}
