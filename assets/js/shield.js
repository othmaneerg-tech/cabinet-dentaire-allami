/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SHIELD.JS — Protection anti-inspection du code source      ║
 * ║  Dentelo — Dr. Allami Othmane                               ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Ce script empêche les visiteurs d'inspecter le code, les images
 * et les modèles 3D via les outils de développement du navigateur.
 *
 * ► Désactive le clic droit (contextmenu)
 * ► Bloque F12, Ctrl+Shift+I/J/C, Ctrl+U
 * ► Lance une boucle `debugger` pour figer l'inspecteur
 * ► S'auto-désactive en localhost pour le développeur
 */

;(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 🛡️  SÉCURITÉ DÉVELOPPEUR — Ne JAMAIS bloquer en local
  // ─────────────────────────────────────────────────────────────
  var host = window.location.hostname;
  var isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '' ||
    host.endsWith('.local');

  if (isLocal) {
    console.info(
      '%c🛡️ Shield.js — Mode développeur détecté (' + host + '). Protection désactivée.',
      'color: #3b82f6; font-weight: bold; font-size: 13px;'
    );
    return; // ← On quitte immédiatement, aucun blocage n'est appliqué
  }

  // ─────────────────────────────────────────────────────────────
  // 🔒  OPTION 1 — Blocage du clic droit
  // ─────────────────────────────────────────────────────────────
  document.addEventListener(
    'contextmenu',
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    true // capture phase — intercepte avant tout autre listener
  );

  // ─────────────────────────────────────────────────────────────
  // ⌨️  OPTION 1 — Blocage des raccourcis clavier DevTools
  // ─────────────────────────────────────────────────────────────
  //
  //  F12                → Ouvrir DevTools
  //  Ctrl + Shift + I   → Inspecter (Elements)
  //  Ctrl + Shift + J   → Console
  //  Ctrl + Shift + C   → Sélecteur d'élément
  //  Ctrl + U           → Afficher le code source

  document.addEventListener(
    'keydown',
    function (e) {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + (I | J | C)
      if (
        (e.ctrlKey && e.shiftKey) &&
        (e.key === 'I' || e.key === 'i' ||
         e.key === 'J' || e.key === 'j' ||
         e.key === 'C' || e.key === 'c')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + U (Afficher la source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    true // capture phase
  );

  // ─────────────────────────────────────────────────────────────
  // 🧊  OPTION 4 — Anti-F12 agressif (boucle debugger)
  // ─────────────────────────────────────────────────────────────
  //
  //  Si un utilisateur ouvre DevTools via le menu du navigateur
  //  (contournant les raccourcis), le mot-clé `debugger` fige
  //  immédiatement l'exécution dans l'onglet Sources.
  //
  //  La boucle tourne toutes les 100ms pour une détection
  //  quasi-instantanée.

  setInterval(function () {
    // Appel indirect via Function() pour compliquer la détection
    // et le contournement par les outils automatisés
    (function () {
      return false;
    })
      ['constructor']('debugger')
      ['call']();
  }, 100);

  // ─────────────────────────────────────────────────────────────
  // 🚫  Bonus — Désactive le glisser-déposer des images
  // ─────────────────────────────────────────────────────────────
  //  Empêche de glisser une image vers le bureau ou un autre
  //  onglet pour la télécharger facilement.

  document.addEventListener(
    'dragstart',
    function (e) {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.tagName === 'MODEL-VIEWER') {
        e.preventDefault();
        return false;
      }
    },
    true
  );

  // Confirmation discrète dans la console (en production)
  console.info(
    '%c🛡️ Shield.js — Protection active.',
    'color: #10b981; font-weight: bold; font-size: 11px;'
  );

})();
