import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input, Button, Typography } from "@material-tailwind/react";
import api from "../../../services/api";

export function Home() {
  const position = [47.165517, 27.580742];
  const [shapeId, setShapeId] = useState("");
  const [positions, setPositions] = useState([]); 

  const findShape = async () => {
    try {
      const response = await api.get(`api/v1/tranzy/shapes/${shapeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.status === 200 || response.status === 201) {
        const newPositions = response.data.map(point => [
          point.shape_pt_lat, 
          point.shape_pt_lon
        ]);

        setPositions(newPositions); 
      }
    } catch (error) {
      let errorMessage = "failed";
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server response:", error.response);
        if (error.response.data) {
          errorMessage += ": " + error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage += ": " + error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="mb-2 flex flex-col gap-4">
        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium text-surface-mid-light">
          Shape id
        </Typography>
        <Input
          size="lg"
          placeholder="Shape Id"
          name="name"
          className="!border-surface-mid-dark text-surface-mid-dark focus:!border-secondary"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          onChange={(e) => setShapeId(e.target.value)}
        />
      </div>
      <Button onClick={findShape} className="mt-6 bg-secondary hover:bg-primary duration-200">
        Find Shape
      </Button>

      <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {positions.length > 1 && (
          <Polyline positions={positions} color="blue" weight={5} />
        )}
      </MapContainer>
    </>
  );
}

export default Home;
