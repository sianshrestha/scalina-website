'use client';

import ColorWipe, { WipeNote, WipeWords } from '@/components/ColorWipe';

/* The manifesto IS the light-to-dark change.

   It used to be a plain dark section with a fade in front of it. It is a single
   short line that appears nowhere else on the site (DESIGN.md §7), it fits one
   screen, and it contains nothing interactive — which is exactly the shape a
   pinned wipe needs. So the section performs the crossing itself: the dark
   ground arrives by wiping up through the line rather than cross-fading behind
   it, and `ground="dark"` means the close below inherits that ground and
   transitions to nothing.

   The lime sub-line survives the move: on the incoming dark layer it is
   #CDF22B at 15.6:1, and on the outgoing light layer it has to be cobalt, since
   lime on #F5F2F3 is 1.2:1. That is the one thing the two layers do NOT share,
   and it is why the note takes an explicit colour per layer. */
export default function Manifesto() {
  return (
    <ColorWipe
      direction="up"
      ariaLabel="Manifesto"
      ground="dark"
      fromBg="#F5F2F3"
      fromFg="#0B0D12"
      toBg="#08080A"
      toFg="#F4F2ED"
      scrollLength={2}
      centred
      noteColorFrom="#1E45FB"
      noteColorTo="#CDF22B"
    >
      <WipeWords lines={['Both halves.', 'That’s the whole job.']} />
      <WipeNote>
        The businesses winning right now are the ones that show up everywhere and run on systems
        that don’t break under the weight of it.
      </WipeNote>
    </ColorWipe>
  );
}
