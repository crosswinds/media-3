export class Config {
  /// The configuration version. Read-only; used for save/load migrations.
  static get Version() {
    return 1
  }

  /// The localStorage key for saved configuration. Avoid changing, as this will lose existing data.
  static get StorageKey() {
    return 'media3-config'
  }

  /// Stores the important parts of Config between uses of the player.
  static Save() {
    if (!localStorage) { // Storage is not available so there's no point trying.
      return
    }
    try {
      const data = JSON.stringify({
        Version: Config.#Version,
        Volume: Config.#Volume,
        RepeatEnabled: Config.#RepeatEnabled,
        CreditsEnabled: Config.#CreditsEnabled
      })
      localStorage.setItem(Config.StorageKey, data)
    }
    catch (error) {
      console.log(error)
    }
  }

  /// Fetches the stored config if any, updates it if necessary, and applies it to Config.
  static Load() {
    if (!localStorage) { // Storage is not available so we're stuck with defaults.
      return
    }
    try {
      const data = localStorage.getItem(Config.StorageKey)
      if (!data) {
        Config.Save()
        return
      }
      const savedConfig = JSON.parse(data)
      const migrated = Config.#Migrate(savedConfig)
      Config.#Apply(savedConfig)
      if (migrated) {
        Config.Save()
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  /// Updates savedConfig according to the difference between Config.Version and savedConfig.Version.
  static #Migrate(savedConfig) {
    let changed = false
    // While savedConfig.Version is less than Config.Version, check for the next migration step and apply it.
    return changed
  }

  /// Copies savedConfig into Config. Use get/set instead of setting privates directly.
  static #Apply(savedConfig) {
    Config.Volume = savedConfig.Volume
    Config.RepeatEnabled = savedConfig.RepeatEnabled
    Config.CreditsEnabled = savedConfig.CreditsEnabled
  }

  static {
    Config.Load()
  }

  /* Actual configuration values follow. Neat! */

  /// The current player volume from 0 to 1. The setter enforces the type and range.
  static #Volume = 0.5

  static get Volume() {
    return Config.#Volume
  }

  static set Volume(scalar) {
    if (typeof scalar !== 'number') {
      scalar = 0.5
    }
    Config.#Volume = Math.min(Math.max(scalar, 0), 1)
  }

  /// Whether the current state's music should fade to silence or repeat. The setter enforces truthiness.
  static #RepeatEnabled = false

  static get RepeatEnabled() {
    return Config.#RepeatEnabled
  }

  static set RepeatEnabled(bool) {
    Config.#RepeatEnabled = !!bool
  }

  /// Whether the current music's credits should be shown on the player face. The setter enforces truthiness.
  static #CreditsEnabled = false

  static get CreditsEnabled() {
    return Config.#CreditsEnabled
  }

  static set CreditsEnabled(bool) {
    Config.#CreditsEnabled = !!bool
  }
}
