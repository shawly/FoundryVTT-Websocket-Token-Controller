/**
 * This file is part of the Foundry VTT Module Mindflayer.
 *
 * The Foundry VTT Module Mindflayer is free software: you can redistribute it and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * The Foundry VTT Module Mindflayer is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with the Foundry VTT Module Mindflayer. If not,
 * see <https://www.gnu.org/licenses/>.
 */
"use strict";
import { settings } from "./settings";
import * as dependencies from "./dependencies";
import loader from "./modules/loader";
import AbstractSubModule from "./modules/AbstractSubModule";
import ControllerManager from "./modules/ControllerManager";

export default class MindFlayer {
  #settings = null;
  #modules = [];

  constructor() {
    this.#settings = settings.init();
  }

  /**
   * @type {settings}
   */
  get settings() {
    return this.#settings;
  }

  /**
   * @type {AbstractSubModule[]}
   */
  get modules() {
    return this.#modules;
  }

  ready() {
    if (dependencies.warnIfAnyMissing() && this.#settings.enabled) {
      loader(this);
    }
  }

  handleCombatUpdate(combat, update) {
    if (combat.combatant) {
      const activePlayerIds = combat.combatant.players.map(
        (player) => player.id
      );
      this.#modules[ControllerManager.name].keypads.forEach((keypad) => {
        const player = keypad.player;
        if (activePlayerIds.includes(player.id)) {
          keypad.setLED(1, "#FF0000");
        } else {
          keypad.setLED(1, player.data.color);
        }
      });
    }
  }
}
