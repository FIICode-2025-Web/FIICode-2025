import { Card, Typography } from "@material-tailwind/react";

export default function BadgesSection() {
  return (
    <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-white font-semibold">
        Medalii
      </Typography>
      <div className="flex flex-wrap gap-3">
        <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">Trotinetist</span>
        <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">Tralalero Tralala</span>
        <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">Vanator de tramvai 9</span>
      </div>
    </Card>
  );
}
