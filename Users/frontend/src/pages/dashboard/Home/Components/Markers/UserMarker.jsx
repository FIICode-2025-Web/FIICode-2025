import { Marker, Popup } from "react-leaflet";

const UserMarker = ({ userLocation, icon }) => {
    return (
        <Marker position={userLocation} icon={icon}>
            <Popup close>
                <div className="flex flex-col space-y-0 leading-tight text-sm">
                    <p className="m-0 p-0 text-center font-bold">Locația ta</p>
                </div>
            </Popup>
        </Marker>
    )
}

export default UserMarker