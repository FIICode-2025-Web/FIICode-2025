from app.database import Base
from sqlalchemy import Column, Integer, String, Float


class TranzyVehicles(Base):
    __tablename__ = 'tranzy_vehicles'

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(String)
    speed = Column(Integer)
    route_id = Column(Integer)
    trip_id = Column(Integer)
    vehicle_type = Column(Integer)
    bike_accessible = Column(String)
    wheelchair_accessible = Column(String)

class TranzyRoutes(Base):
    __tablename__ = 'tranzy_routes'

    route_id = Column(Integer, primary_key=True, index=True)
    agency_id = Column(Integer)
    route_short_name = Column(String)
    route_long_name = Column(String)
    route_color = Column(String)
    route_type = Column(Integer)
    route_desc = Column(String)

class TranzyStops(Base):
    __tablename__ = 'tranzy_stops'

    stop_id = Column(Integer, primary_key=True, index=True)
    stop_name = Column(String)
    stop_desc = Column(String)
    stop_lat = Column(Float)
    stop_lon = Column(Float)
    location_type = Column(Integer)
    stop_code = Column(String)

class TranzyStopTimes(Base):
    __tablename__ = 'tranzy_stop_times'

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer)
    stop_id = Column(Integer)
    stop_sequence = Column(Integer)

class TranzyTrips(Base):
    __tablename__ = 'tranzy_trips'

    trip_id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer)
    trip_headsign = Column(String)
    direction_id = Column(Integer)
    block_id = Column(Integer)
    shape_id = Column(String)

class TranzyShapes(Base):
    __tablename__ = 'tranzy_shapes'

    id = Column(Integer, primary_key=True, index=True)
    shape_id = Column(String)
    shape_pt_lat = Column(Float)
    shape_pt_lon = Column(Float)
    shape_pt_sequence = Column(Integer)

    class Config:
        orm_mode = True

