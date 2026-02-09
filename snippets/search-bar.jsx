/**
 * SearchBar Component
 * A reusable search input trigger that opens the main search modal.
 * 
 * @param {string} placeholder - Text shown in the search bar
 * @param {string} shortcut - Keyboard shortcut to display (e.g., "⌘K")
 * @param {string} maxWidth - Max width constraint as CSS value (e.g., "20rem", "400px")
 * @param {string} className - Additional classes to merge with defaults
 */
export const SearchBar = ({
  placeholder = "Search or ask...",
  shortcut = "⌘K",
  maxWidth = "",
  className = "",
}) => {
  // ===== STYLES =====
  // Organized by concern for easy modification

  const styles = {
    // Layout & sizing
    layout: "flex items-center justify-between",
    width: "w-full",
    spacing: "py-3 pl-5 pr-3",
    shape: "rounded-full",

    // Colors & appearance
    background: "bg-white",
    text: "text-sm text-gray-400 dark:text-gray-500",
    // Double border: inner darker, outer lighter
    border: "border border-gray-300 dark:border-gray-600 ring-8 ring-gray-200/60 dark:ring-white/15",

    // Interactive states
    hover: "hover:border-gray-400 dark:hover:border-gray-500 hover:ring-gray-200/50 dark:hover:ring-white/15",
    cursor: "cursor-pointer",
    transition: "transition-all duration-200",
  };

  const iconStyles = {
    size: "h-4 w-4 flex-none",
    spacing: "mr-2",
    color: "bg-primary hover:bg-gray-600 dark:bg-primary-light dark:hover:bg-white/70",
  };

  const badgeStyles = {
    text: "text-xs font-medium",
    color: "text-gray-400 dark:text-gray-500",
    background: "bg-gray-100",
    spacing: "px-2 py-1",
    shape: "rounded-md",
  };

  // Combine all button styles
  const buttonClasses = [
    styles.layout,
    styles.width,
    styles.spacing,
    styles.shape,
    styles.background,
    styles.text,
    styles.border,
    styles.hover,
    styles.cursor,
    styles.transition,
    className,
  ].join(" ");

  // ===== RENDER =====
  return (
    <button
      type="button"
      id="home-search-entry"
      onClick={() => document.getElementById('search-bar-entry')?.click()}
      className={buttonClasses}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {/* Left side: Icon + Placeholder */}
      <div className="flex items-center">
        <svg
          className={`${iconStyles.size} ${iconStyles.spacing} ${iconStyles.color}`}
          style={{
            maskImage: 'url("https://mintlify.b-cdn.net/v6.5.1/solid/magnifying-glass.svg")',
            maskRepeat: 'no-repeat',
            maskPosition: 'center center',
          }}
        />
        {placeholder}
      </div>

      {/* Right side: Keyboard shortcut badge - hidden on mobile */}
      {shortcut && (
        <span className={`hidden sm:inline-flex ${badgeStyles.text} ${badgeStyles.color} ${badgeStyles.background} ${badgeStyles.spacing} ${badgeStyles.shape}`}>
          {shortcut}
        </span>
      )}
    </button>
  );
};