# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to
Semantic Versioning.

## [Unreleased]
### Added
- OxaPay crypto payment integration with invoice creation and status polling.
- Webhook handler for payment updates with HMAC verification.
- Dedicated payment page with QR code, countdown timer, and auto-redirect.
- OxaPay testing guide and implementation summary documentation.

### Changed
- Order creation flow now starts with pending crypto transactions.
- Cart checkout redirects to payment page and supports two-step payment creation.
- Order receipt now reflects payment status and OxaPay metadata.
- Order model updated with OxaPay payment fields.

### Fixed
- N/A

## [0.9.0] - 2026-01-28
### Added
- Beta release of the application.

### Changed
- Initial centralized configuration and metadata.

### Fixed
- order receipt [id]
- notifiction bell
- refactor to use genVariable
- custom 404 page
- checkout process

## [0.9.1] - 2026-01-31
### Added
- Beta release of the application.

### Changed
- Change Variable Name

### Fixed
- Change from Kubera to Klassico
- update from 
              https://github.com/chemist-god/kubera-master.git to
              https://github.com/chemist-god/klassico
