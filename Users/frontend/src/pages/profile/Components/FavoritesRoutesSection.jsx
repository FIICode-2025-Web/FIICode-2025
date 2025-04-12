import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export default function FavoritesRoutesSection() {
  const [favoritesRoutes, setFavoritesRoutes] = useState([])

  const fetchFavoritesRoutes = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://127.0.0.1:8003/api/v1/tranzy/favorite-routes", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setFavoritesRoutes(response.data);
  }

  const deleteFavoriteRoute = async (route_id) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`http://127.0.0.1:8003/api/v1/tranzy/favorite-routes/${route_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.status === 200) {
      toast.success("Ruta a fost ștearsă cu succes!");
    }else {
      toast.error("A apărut o eroare la ștergerea rutei!");
    }
    fetchFavoritesRoutes()
  }

  useEffect(() => {
    fetchFavoritesRoutes()
  }, [])


  return (
    <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-white font-semibold">
        Rute favorite
      </Typography>
      <div className="flex flex-col gap-3 space-y-3 max-h-[13rem] overflow-y-auto pr-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`ul::-webkit-scrollbar { display: none; }`}</style>
        {!favoritesRoutes || favoritesRoutes.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full text-gray-500">
            Nu ai adăugat rute favorite.
          </div>
        ) : null}
        {favoritesRoutes && favoritesRoutes.map((route) => {
          return (
            <div className="flex justify-between items-center gap-4 border border-gray-500 rounded-lg p-3 hover:bg-gray-800 text-gray-300" key={route.route_id}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold text-sm rounded-md uppercase">
                  {route.route_short_name}
                </div>
                <p>
                  {route.route_long_name}
                </p>
              </div>
              <img src="/img/bin.png" className="w-5 h-5 cursor-pointer" alt="Delete"
                onClick={() => deleteFavoriteRoute(route.route_id)}
              />
            </div>
          );
        })}

      </div>
    </Card>
  );
}
