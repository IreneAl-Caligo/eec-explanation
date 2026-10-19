import React from 'react';
import AtomicSimulator from './AtomicSimulator';
import BandgapLedSimulator from './BandgapLedSimulator';
import DiodeZenerSimulator from './DiodeZenerSimulator';
import RectifierLabSimulator from './RectifierLabSimulator';
import BjtLabSimulator from './BjtLabSimulator';
import FetJfetLabSimulator from './FetJfetLabSimulator';
import TopicLabWorkbench from './TopicLabWorkbench';

export default function TopicSpecificLabRenderer({ topic, langMode = 'dual' }) {
  if (!topic) return null;
  const num = topic.num;

  const renderSim = () => {

  // TOPIC 0: Semiconductor Diodes & Classifications
  if (num === '0') {
    return <DiodeZenerSimulator topic={topic} preset={{ tab: 'pn_bias', semi: 'Si' }} langMode={langMode} />;
  }

  // TOPIC 1: Covalent Bonding in Semiconductors (Pure Si & Ge Lattice)
  if (num === '1') {
    return <AtomicSimulator topic={topic} preset={{ mat: 'Si', temp: 300 }} langMode={langMode} />;
  }

  // TOPIC 2: Intrinsic Semiconductor Material (Pure Crystal, n = p = ni)
  if (num === '2') {
    return <AtomicSimulator topic={topic} preset={{ mat: 'Si', temp: 350 }} langMode={langMode} />;
  }

  // TOPIC 3: Extrinsic Semiconductor Material (Doping & Mass-Action Law)
  if (num === '3') {
    return <AtomicSimulator topic={topic} preset={{ mat: 'N', temp: 300 }} langMode={langMode} />;
  }

  // TOPIC 4: P-Type Semiconductor (Boron Trivalent Acceptor, Majority Holes)
  if (num === '4') {
    return <AtomicSimulator topic={topic} preset={{ mat: 'P', temp: 300 }} langMode={langMode} />;
  }

  // TOPIC 5: N-Type Semiconductor (Phosphorus Pentavalent Donor, Majority Electrons)
  if (num === '5') {
    return <AtomicSimulator topic={topic} preset={{ mat: 'N', temp: 300 }} langMode={langMode} />;
  }

  // TOPIC 6: Diode Definition & Classification: (i) Rectifying, (ii) Zener, (iii) LED
  if (num === '6') {
    return <DiodeZenerSimulator topic={topic} preset={{ tab: 'pn_bias', semi: 'Si' }} langMode={langMode} />;
  }

  // TOPIC 7: Direct Bandgap Semiconductor (GaAs, GaN: E-k Alignment & Photon Emission)
  if (num === '7') {
    return <BandgapLedSimulator topic={topic} preset={{ bgMode: 'direct' }} langMode={langMode} />;
  }

  // TOPIC 8: Indirect Bandgap Semiconductor (Si, Ge: Momentum Mismatch & Heat Phonons)
  if (num === '8') {
    return <BandgapLedSimulator topic={topic} preset={{ bgMode: 'indirect' }} langMode={langMode} />;
  }

  // TOPIC 9: Definition of LED (Electroluminescent Diode)
  if (num === '9') {
    return <BandgapLedSimulator topic={topic} preset={{ tab: 'led_lab' }} langMode={langMode} />;
  }

  // TOPIC 10: Characteristics of LED (V-I Curve, Color Wavelength λ = 1240/Eg)
  if (num === '10') {
    return <BandgapLedSimulator topic={topic} preset={{ tab: 'led_lab' }} langMode={langMode} />;
  }

  // TOPIC 11: Construction of LED (Epoxy Dome, Reflective Anvil Cup, Wire Bond)
  if (num === '11') {
    return <BandgapLedSimulator topic={topic} preset={{ tab: 'construction' }} langMode={langMode} />;
  }

  // TOPIC 12: Working Principle of LED (Radiative Recombination)
  if (num === '12') {
    return <BandgapLedSimulator topic={topic} preset={{ tab: 'led_lab' }} langMode={langMode} />;
  }

  // TOPIC 13: Characteristics of Zener Diode (Sharp Reverse Breakdown Vz)
  if (num === '13') {
    return <DiodeZenerSimulator topic={topic} preset={{ tab: 'zener_iv' }} langMode={langMode} />;
  }

  // TOPIC 14: Forward Bias & Reverse Bias (Depletion Layer Physics)
  if (num === '14') {
    return <DiodeZenerSimulator topic={topic} preset={{ tab: 'pn_bias' }} langMode={langMode} />;
  }

  // TOPIC 15: Zener Diode Shunt Voltage Regulator Circuit
  if (num === '15') {
    return <DiodeZenerSimulator topic={topic} preset={{ tab: 'zener_reg' }} langMode={langMode} />;
  }

  // TOPIC 16: BJT Transistor Structure & Biasing Rules (NPN / PNP, Active/Sat/Cutoff)
  if (num === '16') {
    return <BjtLabSimulator topic={topic} preset={{ tab: 'structure' }} langMode={langMode} />;
  }

  // TOPIC 17: Half-Wave Rectifier Circuit & Waveforms (Vdc = 0.318 Vm)
  if (num === '17') {
    return <RectifierLabSimulator topic={topic} preset={{ type: 'half' }} langMode={langMode} />;
  }

  // TOPIC 18: Full-Wave Center-Tapped Rectifier (Vdc = 0.636 Vm, η = 81.2%)
  if (num === '18') {
    return <RectifierLabSimulator topic={topic} preset={{ type: 'full_ct' }} langMode={langMode} />;
  }

  // TOPIC 19 / 20a: 4-Diode Bridge Rectifier & Wave-Shaping (Clippers/Clampers)
  if (num === '19' || num === '20a') {
    return <RectifierLabSimulator topic={topic} preset={{ type: 'bridge' }} langMode={langMode} />;
  }

  // TOPIC 19b: Common-Emitter (CE) NPN Transistor Amplifier (Q-Point & 180° Inversion)
  if (num === '19b') {
    return <BjtLabSimulator topic={topic} preset={{ tab: 'ce_amplifier' }} langMode={langMode} />;
  }

  // TOPIC 20: Field Effect Transistor (FET) Fundamentals (Unipolar, Rin > 10^9 Ω)
  if (num === '20') {
    return <FetJfetLabSimulator topic={topic} preset={{ tab: 'tree' }} langMode={langMode} />;
  }

  // TOPIC 21: Classification of FET (JFET vs Depletion MOSFET vs Enhancement MOSFET)
  if (num === '21') {
    return <FetJfetLabSimulator topic={topic} preset={{ tab: 'tree' }} langMode={langMode} />;
  }

  // TOPIC 22: Definition of JFET & MOSFET (Shockley Equation vs Square-Law)
  if (num === '22') {
    return <FetJfetLabSimulator topic={topic} preset={{ tab: 'jfet_sim' }} langMode={langMode} />;
  }

  // TOPIC 23: JFET Physical Operation & Depletion Pinch-Off
  if (num === '23') {
    return <FetJfetLabSimulator topic={topic} preset={{ tab: 'jfet_sim' }} langMode={langMode} />;
  }

  // TOPIC 24: JFET Construction, BJT vs JFET & Output Curves Family
  if (num === '24') {
    return <FetJfetLabSimulator topic={topic} preset={{ tab: 'jfet_sim' }} langMode={langMode} />;
  }

  // Fallback simulator matching simType
  if (topic.simType === 'atomic') return <AtomicSimulator topic={topic} preset={topic.simPreset} langMode={langMode} />;
  if (topic.simType === 'bandgap_led') return <BandgapLedSimulator topic={topic} preset={topic.simPreset} langMode={langMode} />;
  if (topic.simType === 'diode_bias') return <DiodeZenerSimulator topic={topic} preset={topic.simPreset} langMode={langMode} />;
  if (topic.simType === 'rectifier_lab') return <RectifierLabSimulator topic={topic} preset={topic.simPreset} langMode={langMode} />;
  if (topic.simType === 'bjt_lab') return <BjtLabSimulator topic={topic} preset={topic.simPreset} langMode={langMode} />;
  if (topic.simType === 'fet_lab') return <FetJfetLabSimulator topic={topic} preset={topic.simPreset} langMode={langMode} />;

    return <DiodeZenerSimulator topic={topic} preset={topic.simPreset} langMode={langMode} />;
  };

  return (
    <div className="space-y-4">
      {/* Merged Unified Lab: Primary Experiment Canvas + Integrated Control Deck */}
      {renderSim()}
      <TopicLabWorkbench topic={topic} langMode={langMode} isEmbedded={true} />
    </div>
  );
}
