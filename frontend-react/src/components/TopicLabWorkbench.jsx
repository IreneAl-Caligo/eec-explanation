import React from 'react';
import AtomicWorkbench from './workbenches/AtomicWorkbench';
import BandgapLedWorkbench from './workbenches/BandgapLedWorkbench';
import DiodeZenerWorkbench from './workbenches/DiodeZenerWorkbench';
import RectifierWorkbench from './workbenches/RectifierWorkbench';
import BjtWorkbench from './workbenches/BjtWorkbench';
import FetWorkbench from './workbenches/FetWorkbench';

/**
 * Dynamic TopicLabWorkbench:
 * Mounts a specialized, domain-tailored interactive experiment, schematic canvas,
 * telemetry HUD, and component creator deck for each distinct lab in the 25-topic syllabus.
 */
export default function TopicLabWorkbench(props) {
  const { topic } = props;
  if (!topic) return null;
  const num = String(topic.num || '');

  // 1. Crystal Lattice, Covalent Bonding & Doping Workbench (Topics 1, 2, 3, 4, 5)
  if (topic.simType === 'atomic' || ['1', '2', '3', '4', '5'].includes(num)) {
    return <AtomicWorkbench {...props} />;
  }

  // 2. Direct/Indirect Bandgap & LED Optoelectronics Workbench (Topics 7, 8, 9, 10, 11, 12)
  if (topic.simType === 'bandgap_led' || ['7', '8', '9', '10', '11', '12'].includes(num)) {
    return <BandgapLedWorkbench {...props} />;
  }

  // 3. Rectifiers, Power Supplies & Smoothing Filter Workbench (Topics 17, 18, 19, 20a)
  if (topic.simType === 'rectifier_lab' || ['17', '18', '19', '20a'].includes(num)) {
    return <RectifierWorkbench {...props} />;
  }

  // 4. BJT Transistor & Common-Emitter Amplifier Workbench (Topics 16, 19b)
  if (topic.simType === 'bjt_lab' || ['16', '19b'].includes(num)) {
    return <BjtWorkbench {...props} />;
  }

  // 5. FET, JFET & MOSFET Channel Pinch-Off Workbench (Topics 20, 21, 22, 23, 24)
  if (topic.simType === 'fet_lab' || ['20', '21', '22', '23', '24'].includes(num)) {
    return <FetWorkbench {...props} />;
  }

  // 6. Diode PN Junction & Zener Shunt Voltage Regulator Workbench (Topics 0, 6, 13, 14, 15)
  return <DiodeZenerWorkbench {...props} />;
}
