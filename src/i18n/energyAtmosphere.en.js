/** Symbolic energy-of-the-day atmosphere (EN) — not prediction. */

module.exports = {
  energyAtmosphere: {
    atmosphere: {
      default: [
        "Today favors steady execution over spikes.",
        "The field is neutral — your structure decides the tone.",
        "Pace matters more than pressure today.",
        "A calmer tempo will carry more than force.",
        "Today reads as a maintenance day, not a launch day.",
        "Intensity is optional; consistency is not.",
        "The day opens with room for one clean lane.",
        "Atmosphere: grounded, not dramatic.",
        "Symbolic read: balance over burst.",
        "Today rewards patience in the first half."
      ],
      low: [
        "Today favors slower execution over intensity.",
        "The field suggests conservation, not expansion.",
        "A softer pace protects the nervous system.",
        "Energy is thin — spend it deliberately.",
        "Symbolic atmosphere: restore before you push."
      ],
      warrior: [
        "Today favors sharp execution over comfort.",
        "The field supports discipline, not debate.",
        "Intensity is available — aim it at one target.",
        "Symbolic atmosphere: edge without noise.",
        "A focused push beats a scattered day."
      ],
      overloaded: [
        "Today favors reduction over addition.",
        "The field is noisy — narrow the input.",
        "Symbolic atmosphere: calm before scale.",
        "Overstimulation is the main risk today.",
        "Protect the nervous system first."
      ]
    },
    nervous: {
      default: [
        "The nervous system may react to fragmentation.",
        "Watch for stimulation stacking — tabs, alerts, caffeine.",
        "Body signals arrive before the mind admits overload.",
        "Regulate breath before you regulate the plan.",
        "Symbolic tendency: sensitivity to hurry."
      ],
      low: [
        "The nervous system may feel depleted — honor rest.",
        "Fatigue can masquerade as lack of discipline.",
        "Gentle regulation beats forced push.",
        "Symbolic tendency: low reserve — protect sleep."
      ],
      warrior: [
        "The nervous system can handle load if scope stays narrow.",
        "Channel intensity through the body, not the feed.",
        "Symbolic tendency: ready if you do not scatter."
      ],
      overloaded: [
        "The nervous system may react strongly to overstimulation.",
        "Symbolic tendency: overload — cut input early.",
        "Long exhale before any new commitment.",
        "Silence is part of today's fuel."
      ]
    },
    focus: {
      default: [
        "Protect attention from fragmentation.",
        "One primary lane will outperform three partial ones.",
        "Focus direction: finish what is already open.",
        "Symbolic guidance: one visible target.",
        "Depth on one task beats motion across five."
      ],
      low: [
        "Protect attention — scope must shrink to match fuel.",
        "One small finish is enough symbolic victory.",
        "Focus direction: the smallest honest action."
      ],
      warrior: [
        "Protect attention like a weapon — one edge only.",
        "Focus direction: primary mission, no side lanes.",
        "Symbolic guidance: execute, do not browse."
      ],
      overloaded: [
        "Protect attention by removing input, not adding willpower.",
        "Focus direction: stabilize, then one line of work.",
        "Symbolic guidance: calm the field, then act."
      ]
    },
    discipline: {
      default: [
        "Discipline warning: do not negotiate after noon without reason.",
        "Avoid opening new loops before closing one.",
        "Symbolic caution: mood is not a plan.",
        "One clean action is enough proof of discipline.",
        "Watch for drift disguised as research."
      ],
      low: [
        "Discipline warning: do not shame low energy — adjust scope.",
        "Keep one promise small and visible.",
        "Symbolic caution: heroics will tax recovery."
      ],
      warrior: [
        "Discipline warning: comfort will call — ignore it once.",
        "No new targets until the primary line moves.",
        "Symbolic caution: intensity without finish is noise."
      ],
      drifting: [
        "Discipline warning: drift is the main risk today.",
        "Return to one open loop before any new idea.",
        "Symbolic caution: planning can replace doing."
      ]
    },
    recovery: {
      default: [
        "Recovery reminder: downshift before sleep protects tomorrow.",
        "Fuel and silence are part of today's structure.",
        "Symbolic close: rest is not a reward — it is maintenance.",
        "Protect the evening from another sprint.",
        "The body remembers pressure — release some tonight."
      ],
      low: [
        "Recovery reminder: rest is the work this afternoon.",
        "Sleep and food are non-negotiable structure.",
        "Symbolic close: restore before tomorrow asks for push."
      ],
      warrior: [
        "Recovery reminder: even edge needs a quiet close.",
        "Stop on time — tomorrow's training starts tonight.",
        "Symbolic close: discipline includes stopping."
      ]
    }
  }
};
