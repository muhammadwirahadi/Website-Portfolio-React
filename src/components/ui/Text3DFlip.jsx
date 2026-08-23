import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useAnimate } from "framer-motion";

const HAS_SEGMENTER = typeof Intl !== "undefined" && "Segmenter" in Intl;

const splitIntoCharacters = (text) => {
  if (HAS_SEGMENTER) {
    const segmenter = new Intl.Segmenter("en", {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }

  return Array.from(text);
};

const SECOND_FACE_TRANSFORMS = {
  top: "rotateX(-90deg) translateZ(0.5lh)",
  right:
    "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)",
  bottom: "rotateX(90deg) translateZ(0.5lh)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)",
};

const FRONT_FACE_TRANSFORMS = {
  top: "translateZ(0.5lh)",
  bottom: "translateZ(0.5lh)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg)",
  right: "rotateY(-90deg) translateX(50%) rotateY(90deg)",
};

const CONTAINER_TRANSFORMS = {
  top: "translateZ(-0.5lh) rotateX(0deg)",
  bottom: "translateZ(-0.5lh) rotateX(0deg)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg) rotateY(0deg)",
  right: "rotateY(90deg) translateX(50%) rotateY(-90deg) rotateY(0deg)",
};

const FLIPPED_TRANSFORMS = {
  top: "translateZ(-0.5lh) rotateX(90deg)",
  bottom: "translateZ(-0.5lh) rotateX(-90deg)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg) rotateY(-90deg)",
  right: "rotateY(90deg) translateX(50%) rotateY(-90deg) rotateY(90deg)",
};

const DEFAULT_FONT = {
  fontFamily: "Archivo, sans-serif",
  fontWeight: 700,
  fontSize: "20px",
  letterSpacing: "0.25em",
  lineHeight: "1em",
  textAlign: "center",
};

const DEFAULT_TRANSITION = {
  type: "spring",
  damping: 30,
  stiffness: 300,
  mass: 1,
};

const CharBox = memo(
  ({ char, color, flipColor, rotateDirection }) => (
    <span
      className="text-3d-flip-char"
      style={{
        display: "inline-block",
        transformStyle: "preserve-3d",
        transform: CONTAINER_TRANSFORMS[rotateDirection],
        WebkitTransform: CONTAINER_TRANSFORMS[rotateDirection],
      }}
    >
      <span
        style={{
          position: "relative",
          display: "block",
          height: "1.2em",
          color,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: FRONT_FACE_TRANSFORMS[rotateDirection],
          WebkitTransform: FRONT_FACE_TRANSFORMS[rotateDirection],
        }}
      >
        {char}
      </span>
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "block",
          height: "1.2em",
          color: flipColor,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: SECOND_FACE_TRANSFORMS[rotateDirection],
          WebkitTransform: SECOND_FACE_TRANSFORMS[rotateDirection],
        }}
      >
        {char}
      </span>
    </span>
  )
);

CharBox.displayName = "CharBox";

function __OriginkitBase_Text3DFlip(props) {
  const {
    text = "EXPERIENCES",
    font = DEFAULT_FONT,
    color = "#4A1620",
    flipColor = "#F0E4C8",
    staggerDuration = 0.04,
    staggerFrom = "first",
    animation = "hover",
    tag = "span",
    transition = DEFAULT_TRANSITION,
    rotateDirection = "top",
    style,
    isHovered = false, // Bisa dikontrol dari parent hover
  } = props;
  const content = text;
  const isAnimatingRef = useRef(false);
  const isMountedRef = useRef(false);
  const canTriggerHoverRef = useRef(true);
  const [scope, animate] = useAnimate();

  const restingTransform = CONTAINER_TRANSFORMS[rotateDirection];
  const flippedTransform = FLIPPED_TRANSFORMS[rotateDirection];

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      isAnimatingRef.current = false;
    };
  }, []);

  const characters = useMemo(() => {
    const words = content.split(" ");
    return words.map((word, index) => ({
      characters: splitIntoCharacters(word),
      needsSpace: index !== words.length - 1,
    }));
  }, [content]);

  const charOffsets = useMemo(() => {
    const offsets = [0];

    for (const word of characters) {
      offsets.push(offsets[offsets.length - 1] + word.characters.length);
    }

    return offsets;
  }, [characters]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") {
        return (totalChars - 1 - index) * staggerDuration;
      }
      if (staggerFrom === "center") {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }

      const randomIndex = Math.floor(Math.random() * totalChars);
      return Math.abs(randomIndex - index) * staggerDuration;
    },
    [staggerDuration, staggerFrom]
  );

  const playAnimation = useCallback(async () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    try {
      const totalChars = characters.reduce(
        (sum, word) => sum + word.characters.length,
        0
      );
      const delays = Array.from({ length: totalChars }, (_, index) =>
        getStaggerDelay(index, totalChars)
      );

      await animate(
        ".text-3d-flip-char",
        { transform: flippedTransform },
        {
          ...transition,
          delay: (index) => delays[index] ?? 0,
        }
      );

      if (!isMountedRef.current) return;

      await animate(
        ".text-3d-flip-char",
        { transform: restingTransform },
        { duration: 0, delay: 0 }
      );
    } finally {
      if (isMountedRef.current) {
        isAnimatingRef.current = false;
      }
    }
  }, [
    animate,
    characters,
    flippedTransform,
    getStaggerDelay,
    restingTransform,
    transition,
  ]);

  // Efek trigger otomatis saat props isHovered dari parent berubah
  useEffect(() => {
    if (animation === "hover" && isHovered) {
      playAnimation();
    }
  }, [isHovered, animation, playAnimation]);

  useEffect(() => {
    if (animation !== "enter") return;
    playAnimation();
  }, [animation, content, playAnimation]);

  const handlePointerEnter = () => {
    if (animation !== "hover" || !canTriggerHoverRef.current || isHovered) return;
    canTriggerHoverRef.current = false;
    playAnimation();
  };

  const handlePointerLeave = () => {
    canTriggerHoverRef.current = true;
  };

  const textAlign = font.textAlign ?? "center";
  const justifyContent =
    textAlign === "center"
      ? "center"
      : textAlign === "right" || textAlign === "end"
        ? "flex-end"
        : "flex-start";

  return (
    <div
      onPointerEnter={animation === "hover" && !isHovered ? handlePointerEnter : undefined}
      onPointerLeave={animation === "hover" && !isHovered ? handlePointerLeave : undefined}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {React.createElement(
        tag,
        {
          ref: scope,
          "aria-label": content,
          style: {
            ...font,
            position: "relative",
            margin: 0,
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent,
            perspective: 800,
            perspectiveOrigin: "center center",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
            color,
          },
        },
        characters.map((wordObject, wordIndex) => (
          <span
            key={wordIndex}
            aria-hidden="true"
            style={{
              display: "inline-flex",
              transformStyle: "preserve-3d",
            }}
          >
            {wordObject.characters.map((char, charIndex) => (
              <CharBox
                key={charOffsets[wordIndex] + charIndex}
                char={char}
                color={color}
                flipColor={flipColor}
                rotateDirection={rotateDirection}
              />
            ))}
            {wordObject.needsSpace ? (
              <span style={{ whiteSpace: "pre" }}> </span>
            ) : null}
          </span>
        ))
      )}
    </div>
  );
}

__OriginkitBase_Text3DFlip.displayName = "Text3DFlipBase";

const __originkitPresetProps = {
  "text": "EXPERIENCES",
  "font": DEFAULT_FONT,
  "transition": DEFAULT_TRANSITION
};

export default function Text3DFlip(props) {
  return <__OriginkitBase_Text3DFlip {...__originkitPresetProps} {...props} />;
}
