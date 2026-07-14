// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// // Ionic Icon
// import { IonIcon } from '@ionic/angular/standalone';
// import { addIcons } from 'ionicons';
// import { logoIonic } from 'ionicons/icons';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, IonIcon],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('my_portfolio');
// }

// import { Component, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Ionic Icon
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoIonic } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IonIcon],
  templateUrl: './app.html',
})
export class App {
  menuOpen = signal(false);

  currentYear = new Date().getFullYear();

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  navItems = [
    {
      id: 'intro',
      name: 'About',
    },
    {
      id: 'education',
      name: 'Education',
    },
    {
      id: 'projects',
      name: 'Projects',
    },
    {
      id: 'skills',
      name: 'Skills',
    },
    {
      id: 'connect',
      name: 'Connect',
    },
  ];

  education = [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      duration: '2021 - 2025',
      institute: 'Bengal Institute of Technology',
    },
    {
      degree: 'Higher Secondary',
      duration: '2018 - 2020',
      institute: 'M.G. Rungta Academy',
    },
    {
      degree: 'Secondary Education',
      duration: '2007 - 2018',
      institute: 'Dakshin Calcutta Arya Vidyalaya',
    },
  ];

  projects = [
    {
      title: 'MNREGA 2.0',
      description:
        'A digital platform for MGNREGA workers and Gram Panchayat officers to manage attendance, payments, work allocation and progress.',

      image: 'assets/projects/mnrega.png',

      tech: ['Angular', 'Express', 'PostgreSQL', 'Supabase'],

      live: 'https://nrega-2-0.vercel.app',

      github: 'https://github.com/Jay9874/nrega2.0',
    },

    {
      title: 'GDSC BIT',

      description:
        'Official Google Developer Student Club website for Bengal Institute of Technology.',

      image: 'assets/projects/gdsc.png',

      tech: ['Angular', 'Firebase', 'Tailwind'],

      live: 'https://gdsc-bit.vercel.app',

      github: 'https://github.com/Jay9874/GDSC-BIT',
    },

    {
      title: 'JF Interio',

      description:
        'Furniture manufacturing business website with online catalogue and enquiry system.',

      image: 'assets/projects/interio.png',

      tech: ['Angular', 'Node.js', 'MongoDB'],

      live: 'https://jfinterio.vercel.app',

      github: 'https://github.com/Jay9874/jf_interio',
    },

    {
      title: 'deChat',

      description: 'A decentralized messaging application focused on privacy and blockchain.',

      image: 'assets/projects/dechat.png',

      tech: ['Blockchain', 'React', 'Node'],

      live: 'https://dechats.vercel.app/',

      github: 'https://github.com/Jay9874/deChat',
    },

    {
      title: 'Student Monitoring System',

      description:
        'Machine learning based academic monitoring system for teachers and institutions.',

      image: 'assets/projects/student.png',

      tech: ['Python', 'Machine Learning', 'Angular'],

      live: 'https://student-monitoring-2-0.vercel.app/account/',

      github: 'https://github.com/Jay9874/student_monitoring_2.0',
    },
  ];

  languages = [
    {
      name: 'C',
      rating: '★★★★★',
    },

    {
      name: 'C++',
      rating: '★★★★★',
    },

    {
      name: 'Java',
      rating: '★★★★★',
    },

    {
      name: 'Python',
      rating: '★★★★☆',
    },

    {
      name: 'JavaScript',
      rating: '★★★★★',
    },

    {
      name: 'TypeScript',
      rating: '★★★★★',
    },
  ];

  skills = [
    'Angular',

    'React',

    'Node.js',

    'Express.js',

    'PostgreSQL',

    'Supabase',

    'MongoDB',

    'Python',

    'Java',

    'C++',

    'TensorFlow',

    'OpenCV',

    'Git',

    'GitHub',

    'Docker',

    'Tailwind CSS',

    'Linux',

    'Oracle DBA',

    'REST APIs',

    'Machine Learning',
  ];

  profiles = [
    {
      name: 'GitHub',

      username: 'Jay9874',

      link: 'https://github.com/Jay9874',
    },

    {
      name: 'LeetCode',

      username: 'Jay9874',

      link: 'https://leetcode.com/Jay9874/',
    },

    {
      name: 'CodeChef',

      username: 'jay9874',

      link: 'https://www.codechef.com/users/jay9874',
    },

    {
      name: 'Codeforces',

      username: 'Jay9874',

      link: 'https://codeforces.com/profile/Jay9874',
    },
  ];
}
