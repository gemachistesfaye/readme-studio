import { LicenseType } from '@/types';

export interface LicenseOption {
  type: LicenseType;
  name: string;
  description: string;
  notice: string;
}

export const LICENSE_OPTIONS: LicenseOption[] = [
  {
    type: 'MIT',
    name: 'MIT License',
    description: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices.',
    notice: 'This project is licensed under the MIT License.',
  },
  {
    type: 'Apache-2.0',
    name: 'Apache License 2.0',
    description: 'A permissive license whose main conditions require preservation of copyright and license notices, with an express grant of patent rights.',
    notice: 'This project is licensed under the Apache License 2.0.',
  },
  {
    type: 'GPL-3.0',
    name: 'GNU General Public License v3.0',
    description: 'Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications.',
    notice: 'This project is licensed under the GNU General Public License v3.0.',
  },
  {
    type: 'BSD-3-Clause',
    name: 'BSD 3-Clause License',
    description: 'A permissive license similar to the BSD 2-Clause License, but with a clause prohibiting using author/contributor names for endorsement.',
    notice: 'This project is licensed under the BSD 3-Clause License.',
  },
  {
    type: 'ISC',
    name: 'ISC License',
    description: 'A permissive license functionally equivalent to the MIT license with simplified language.',
    notice: 'This project is licensed under the ISC License.',
  },
  {
    type: 'MPL-2.0',
    name: 'Mozilla Public License 2.0',
    description: 'A weak copyleft license that permits integration with other open-source or proprietary software.',
    notice: 'This project is licensed under the Mozilla Public License 2.0.',
  },
  {
    type: 'Unlicense',
    name: 'The Unlicense',
    description: 'A template for disclaiming copyright interest in software to dedicate it completely to the public domain.',
    notice: 'This is free and unencumbered software released into the public domain.',
  },
  {
    type: 'Proprietary',
    name: 'Proprietary / Closed Source',
    description: 'All rights reserved. Unauthorized copying, modification, or distribution is strictly prohibited.',
    notice: 'This project is proprietary software. All rights reserved.',
  },
  {
    type: 'Custom',
    name: 'Custom License',
    description: 'Provide your own custom license name and notice terms.',
    notice: 'This project is licensed under a custom license.',
  },
  {
    type: 'None',
    name: 'None (Omit License Section)',
    description: 'No license section will be rendered in the generated README.',
    notice: '',
  },
];

export const DEFAULT_LICENSE_TYPE: LicenseType = 'MIT';
