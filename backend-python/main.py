from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from spice_solver import solve_pn_diode, solve_zener_regulator, solve_jfet_characteristics

app = FastAPI(title="CSE 1st Year EEC Simulation API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/simulate/diode")
def api_diode(vd: float = 0.75, temp_k: float = 300.0, material: str = "Si"):
    return solve_pn_diode(vd, temp_k, material)

@app.get("/api/simulate/zener")
def api_zener(vin: float = 15.0, vz: float = 6.8, rs: float = 220.0, rl: float = 470.0):
    return solve_zener_regulator(vin, vz, rs, rl)

@app.get("/api/simulate/jfet")
def api_jfet(vgs: float = -1.0, vds: float = 6.0, idss: float = 10.0, vp: float = -4.0):
    return solve_jfet_characteristics(vgs, vds, idss, vp)
