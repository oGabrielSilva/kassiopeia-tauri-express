export async function requireKassiopeiaValidation() {
  const { ValidationKassiopeiaTool } = await import('kassiopeia-tools')
  return new ValidationKassiopeiaTool()
}

export async function requireKassiopeiaAnimation() {
  const { AnimationKassiopeiaTool } = await import('kassiopeia-tools')
  return new AnimationKassiopeiaTool()
}

export async function requireKassiopeiaScreenLocker() {
  const { ScreenLockerKassiopeiaTool } = await import('kassiopeia-tools')
  return ScreenLockerKassiopeiaTool.get().configureTo({
    background: '#000000',
    opacity: 0.8,
    bars: [
      { width: '35%', color: 'hsl(171, 100%, 41%)', height: 2, speed: 1500 },
      { width: '35%', color: 'hsl(171, 100%, 41%)', height: 2, speed: 1000 },
    ],
  })
}

export async function requireKassiopeiaToaster() {
  const { ToasterKassiopeiaTool, Vec2D } = await import('kassiopeia-tools')

  return ToasterKassiopeiaTool.getConfigured({
    ...ToasterKassiopeiaTool.defaultConfiguration(),

    background: {
      danger: {
        color: 'hsl(348, 100%, 61%)',
        padding: Vec2D.of(1, 1),
        useVectorWithRem: true,
        opacity: 0.85,
      },
      info: {
        color: 'hsl(217, 71%, 53%)',
        padding: Vec2D.of(1, 1),
        useVectorWithRem: true,
        opacity: 0.85,
      },
      success: {
        color: 'hsl(141, 71%, 48%)',
        padding: Vec2D.of(1, 1),
        useVectorWithRem: true,
        opacity: 0.85,
      },
      warn: {
        color: 'hsl(48, 100%, 67%)',
        padding: Vec2D.of(1, 1),
        useVectorWithRem: true,
        opacity: 0.85,
      },
    },
    text: {
      danger: {
        color: 'hsl(0, 0%, 100%)',
        font: '"JetBrains Mono", monospace',
        weight: '500',
        size: 14,
      },
      info: {
        color: 'hsl(0, 0%, 100%)',
        font: '"JetBrains Mono", monospace',
        weight: '500',
        size: 14,
      },
      warn: {
        color: 'hsl(0, 0%, 4%)',
        font: '"JetBrains Mono", monospace',
        weight: '500',
        size: 14,
      },
      success: {
        color: 'hsl(0, 0%, 4%)',
        font: '"JetBrains Mono", monospace',
        weight: '500',
        size: 14,
      },
    },
    progressBar: {
      danger: {
        color: 'hsl(0, 0%, 100%)',
        height: 4,
        time: 5000,
      },
      info: {
        color: 'hsl(0, 0%, 100%)',
        height: 4,
        time: 5000,
      },
      success: {
        color: 'hsl(0, 0%, 100%)',
        height: 4,
        time: 5000,
      },
      warn: {
        color: 'hsl(0, 0%, 100%)',
        height: 4,
        time: 5000,
      },
    },
    container: {
      position3D: {
        x: 10,
        y: 10,
        z: 99999,
      },
      boundary: { x: 'end', y: 'top' },
      maxWidth: '70vw',
      outSide: 'end',
      useVectorWithPercentage: true,
    },
  })
}
