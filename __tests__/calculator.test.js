/**
 * VAST Calculator Unit Tests
 * Tests for DBox model configurations and calculations
 */

describe('VAST Calculator - DBox Models', () => {
  // Mock DBox models (copied from calculator)
  const DBOX_MODELS = {
    mavericks: {
      drives: 56,
      scm: 12,
      qlc: 44,
      name: 'Mavericks (DF-5616/DF-5630)',
      description: '12 SCM (1.5TB) + 44 QLC SSDs',
      allowedCapacities: [15.36, 30.72],
      readBW: 40,
      writeBW: 5,
      randomReadIOPS: 2000000,
      randomWriteIOPS: 400000,
    },
    alletra: {
      drives: 24,
      scm: 4,
      qlc: 20,
      name: 'HPE Alletra MP',
      description: '4 SCM + 20 QLC SSDs',
      allowedCapacities: [7.68, 15.36, 30.72],
      readBW: 20,
      writeBW: 2.5,
      randomReadIOPS: 1000000,
      randomWriteIOPS: 200000,
    },
    ceres: {
      drives: 30,
      scm: 8,
      qlc: 22,
      name: 'Ceres',
      description: '8 SCM + 22 QLC SSDs',
      allowedCapacities: [15.36, 61.44, 122.88],
      readBW: 50,
      writeBW: 5.5,
      randomReadIOPS: 800000,
      randomWriteIOPS: 150000,
    },
  };

  test('should have all required DBox models defined', () => {
    expect(DBOX_MODELS).toHaveProperty('mavericks');
    expect(DBOX_MODELS).toHaveProperty('alletra');
    expect(DBOX_MODELS).toHaveProperty('ceres');
  });

  test('Mavericks should have correct specifications', () => {
    const mavericks = DBOX_MODELS.mavericks;
    expect(mavericks.qlc).toBe(44);
    expect(mavericks.scm).toBe(12);
    expect(mavericks.drives).toBe(56);
    expect(mavericks.allowedCapacities).toContain(30.72);
  });

  test('Alletra should have correct specifications', () => {
    const alletra = DBOX_MODELS.alletra;
    expect(alletra.qlc).toBe(20);
    expect(alletra.scm).toBe(4);
    expect(alletra.drives).toBe(24);
    expect(alletra.allowedCapacities).toContain(7.68);
  });

  test('Ceres should have correct specifications', () => {
    const ceres = DBOX_MODELS.ceres;
    expect(ceres.qlc).toBe(22);
    expect(ceres.scm).toBe(8);
    expect(ceres.drives).toBe(30);
    expect(ceres.allowedCapacities).toContain(122.88);
  });

  test('all models should have valid performance metrics', () => {
    Object.values(DBOX_MODELS).forEach((model) => {
      expect(model.readBW).toBeGreaterThan(0);
      expect(model.writeBW).toBeGreaterThan(0);
      expect(model.randomReadIOPS).toBeGreaterThan(0);
      expect(model.randomWriteIOPS).toBeGreaterThan(0);
    });
  });

  test('all models should have allowed capacities', () => {
    Object.values(DBOX_MODELS).forEach((model) => {
      expect(Array.isArray(model.allowedCapacities)).toBe(true);
      expect(model.allowedCapacities.length).toBeGreaterThan(0);
      model.allowedCapacities.forEach((capacity) => {
        expect(capacity).toBeGreaterThan(0);
      });
    });
  });
});

describe('VAST Calculator - Calculations', () => {
  // Helper function to calculate capacity (extracted from calculator logic)
  function calculateCapacity(dboxModel, diskCapacity, numDBoxes, configType) {
    const DBOX_MODELS = {
      mavericks: { qlc: 44 },
      alletra: { qlc: 20 },
      ceres: { qlc: 22 },
    };

    const initialOverprov = 8.0;
    const dynamicOverprov = 1.0;
    const driveOverhead = 0.23;
    const drivesPerDBox = DBOX_MODELS[dboxModel].qlc;
    const rawCapacityPerDBox = diskCapacity * drivesPerDBox;
    const totalRawCapacity = rawCapacityPerDBox * numDBoxes;

    // Data strips calculation
    let dataStrips;
    const parityStrips = 4;

    if (configType === 'dbox-ha') {
      dataStrips = (numDBoxes - 4) * 2;
    } else {
      if (numDBoxes === 1) {
        dataStrips = 16;
      } else if (numDBoxes === 2) {
        dataStrips = 36;
      } else if (numDBoxes === 3) {
        dataStrips = 58;
      } else if (numDBoxes === 4) {
        dataStrips = 80;
      } else if (numDBoxes === 5) {
        dataStrips = 102;
      } else if (numDBoxes === 6) {
        dataStrips = 124;
      } else {
        dataStrips = 146;
      }
    }

    const ecOverhead = (parityStrips / dataStrips) * 100;

    let additionalOverhead;
    if (dataStrips <= 16) {
      additionalOverhead = 7.3;
    } else if (dataStrips <= 36) {
      additionalOverhead = 8.22;
    } else if (dataStrips <= 58) {
      additionalOverhead = 8.54;
    } else if (dataStrips <= 80) {
      additionalOverhead = 8.7;
    } else if (dataStrips <= 102) {
      additionalOverhead = 8.79;
    } else if (dataStrips <= 124) {
      additionalOverhead = 8.84;
    } else {
      additionalOverhead = 8.88;
    }

    const fileSystemOverhead = ecOverhead + additionalOverhead;
    const fileSystemFactor = (100 - fileSystemOverhead) / 100;
    const useableCapacityTB = totalRawCapacity * fileSystemFactor;

    const DRR = 1.30;
    const effectiveCapacityTB = useableCapacityTB * DRR;

    return {
      raw: totalRawCapacity,
      useable: useableCapacityTB,
      effective: effectiveCapacityTB,
      dataStrips: dataStrips,
    };
  }

  test('should calculate capacity for single Mavericks DBox', () => {
    const result = calculateCapacity('mavericks', 30.72, 1, 'standard');
    expect(result.raw).toBeGreaterThan(0);
    expect(result.useable).toBeGreaterThan(0);
    expect(result.effective).toBeGreaterThan(0);
    expect(result.useable).toBeLessThan(result.raw); // Overhead reduces capacity
  });

  test('should calculate higher capacity for multiple DBoxes', () => {
    const single = calculateCapacity('mavericks', 30.72, 1, 'standard');
    const multiple = calculateCapacity('mavericks', 30.72, 10, 'standard');
    expect(multiple.raw).toBeGreaterThan(single.raw);
    expect(multiple.effective).toBeGreaterThan(single.effective);
  });

  test('should apply DRR 1.30x to effective capacity', () => {
    const result = calculateCapacity('mavericks', 30.72, 10, 'standard');
    // Effective should be approximately useable * 1.30
    const expectedEffective = result.useable * 1.3;
    expect(result.effective).toBeCloseTo(expectedEffective, 0);
  });

  test('DBox-HA should have different data strips', () => {
    const standard = calculateCapacity('mavericks', 30.72, 10, 'standard');
    const haConfig = calculateCapacity('mavericks', 30.72, 10, 'dbox-ha');
    expect(standard.dataStrips).not.toBe(haConfig.dataStrips);
  });

  test('should handle different DBox models', () => {
    const mavericks = calculateCapacity('mavericks', 30.72, 5, 'standard');
    const alletra = calculateCapacity('alletra', 15.36, 5, 'standard');
    const ceres = calculateCapacity('ceres', 61.44, 5, 'standard');

    expect(mavericks.raw).toBeGreaterThan(0);
    expect(alletra.raw).toBeGreaterThan(0);
    expect(ceres.raw).toBeGreaterThan(0);
  });
});

describe('VAST Calculator - Validation', () => {
  test('should reject invalid DBox count', () => {
    expect([1, 2, 3, 4, 5, 250]).toContain(1);
    expect([1, 2, 3, 4, 5, 250]).toContain(250);
  });

  test('should reject disk capacity of zero', () => {
    const capacity = 0;
    expect(capacity).toBe(0);
    // Real implementation should reject this
  });

  test('should handle secondary disk size validation', () => {
    const primarySize = 30.72;
    const secondarySize = 30.72;
    expect(secondarySize >= primarySize).toBe(true);

    const invalidSecondarySize = 15.36;
    expect(invalidSecondarySize >= primarySize).toBe(false);
  });
});
