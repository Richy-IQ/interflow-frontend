/**
 * Icon — renders any SVG from /public/assets/icons/{name}.svg
 * as a colorable masked element.
 *
 * Usage:
 *   <Icon name="location" color="#8D5D1D" size={20} />
 *   <Icon name="instagram" color="#fff" size={24} />
 *
 * Drop SVG files into:  public/assets/icons/{name}.svg
 * SVGs should use a single fill/stroke path so the CSS mask works correctly.
 * Remove any hardcoded fill/stroke colors from the SVG — the mask replaces them.
 */

const Icon = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
}) => (
  <span
    aria-hidden="true"
    className={className}
    style={{
      display: 'inline-block',
      flexShrink: 0,
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMask: `url(/assets/icons/${name}.svg) center / contain no-repeat`,
      mask: `url(/assets/icons/${name}.svg) center / contain no-repeat`,
      ...style,
    }}
  />
);

export default Icon;
