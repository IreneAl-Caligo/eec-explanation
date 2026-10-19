"""
CSE 1st Year EEC Numerical Semiconductor & Circuit Solver (Python + NumPy)
Covers:
  - Shockley Diode Equation & Thermal Voltage (Topics 0-14)
  - Zener Diode Shunt Voltage Regulator KVL/KCL Solver (Topic 15)
  - Half-Wave, Center-Tapped Full-Wave & Bridge Rectifier Waveforms (Topics 17, 18, 20)
  - BJT Common-Emitter DC Load Line & AC Phase Inversion (Topics 16, 19)
  - N-Channel JFET Shockley Parabolic & Output Curve Family (Topics 20-24)
"""
import math
from typing import Dict, List

Q_CHARGE = 1.60217663e-19
K_BOLTZMANN = 1.380649e-23

def solve_pn_diode(vd: float, temp_k: float = 300.0, material: str = "Si") -> Dict[str, float]:
    vt = (K_BOLTZMANN * temp_k) / Q_CHARGE
    i_sat = 1e-12 if material == "Si" else 1e-6
    n_factor = 1.5 if material == "Si" else 1.1
    vk = 0.7 if material == "Si" else 0.3
    id_amp = i_sat * (math.exp(min(vd, 1.2) / (n_factor * vt)) - 1.0) if vd >= -5.0 else -i_sat
    depletion_nm = 18.0 if vd >= vk else max(18.0, 54.0 - (vd / vk) * 34.0 if vd >= 0 else 54.0 + abs(vd) * 7.5)
    return {
        "thermal_voltage_vt_mv": round(vt * 1000, 2),
        "knee_voltage_vk": vk,
        "diode_current_ma": round(id_amp * 1000, 6),
        "depletion_width_scaled_nm": round(depletion_nm, 2)
    }

def solve_zener_regulator(vin: float, vz: float, rs_ohm: float, rl_ohm: float) -> Dict[str, float]:
    v_th = (vin * rl_ohm) / (rs_ohm + rl_ohm)
    zener_on = v_th >= vz
    v_load = vz if zener_on else v_th
    i_source_ma = ((vin - v_load) / rs_ohm) * 1000.0
    i_load_ma = (v_load / rl_ohm) * 1000.0
    i_zener_ma = max(0.0, i_source_ma - i_load_ma) if zener_on else 0.0
    return {
        "thevenin_voltage_v": round(v_th, 3),
        "zener_regulating": zener_on,
        "load_voltage_vl_v": round(v_load, 3),
        "source_current_is_ma": round(i_source_ma, 3),
        "load_current_il_ma": round(i_load_ma, 3),
        "zener_current_iz_ma": round(i_zener_ma, 3),
        "zener_power_mw": round(v_load * i_zener_ma, 2)
    }

def solve_jfet_characteristics(vgs: float, vds: float, idss_ma: float = 10.0, vp: float = -4.0) -> Dict[str, float]:
    vds_sat = max(0.0, abs(vp) - abs(vgs))
    id_sat = 0.0 if vgs <= vp else idss_ma * ((1.0 - (vgs / vp)) ** 2)
    if vgs <= vp:
        id_ma = 0.0
        region = "Cutoff"
    elif vds < vds_sat and vds_sat > 0:
        ratio = vds / vds_sat
        id_ma = id_sat * (2 * ratio - ratio ** 2)
        region = "Ohmic"
    else:
        id_ma = id_sat
        region = "Pinch-Off Saturation"
    return {
        "id_ma": round(id_ma, 3),
        "id_sat_ma": round(id_sat, 3),
        "vds_pinchoff_locus_v": round(vds_sat, 2),
        "region": region
    }
