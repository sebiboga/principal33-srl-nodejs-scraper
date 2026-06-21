import { jest } from '@jest/globals';

describe('index.js Component Tests', () => {
  let index;

  beforeAll(async () => {
    index = await import('../../index.js');
  });

  describe('transformJobsForSOLR', () => {
    it('should filter locations to only Romanian cities', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', location: ['România'] },
          { url: 'https://test.com/2', title: 'Job 2', location: ['Bucharest'] },
          { url: 'https://test.com/3', title: 'Job 3', location: ['Bulgaria'] },
          { url: 'https://test.com/4', title: 'Job 4', location: ['Cluj-Napoca'] },
          { url: 'https://test.com/5', title: 'Job 5', location: [] }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].location).toEqual(['România']);
      expect(result.jobs[1].location).toEqual(['Bucharest']);
      expect(result.jobs[2].location).toEqual(['România']);
      expect(result.jobs[3].location).toEqual(['Cluj-Napoca']);
      expect(result.jobs[4].location).toEqual(['România']);
    });

    it('should keep company uppercase', () => {
      const payload = {
        source: 'principal33.jobs.personio.de',
        company: 'principal33 s.r.l.',
        cif: '42574513',
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', company: 'principal33', cif: '42574513' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.company).toBe('PRINCIPAL33 S.R.L.');
    });

    it('should normalize workmode values', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', workmode: 'Remote' },
          { url: 'https://test.com/2', title: 'Job 2', workmode: 'ON-SITE' },
          { url: 'https://test.com/3', title: 'Job 3', workmode: 'Hybrid' },
          { url: 'https://test.com/4', title: 'Job 4', workmode: 'hybrid' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].workmode).toBe('remote');
      expect(result.jobs[1].workmode).toBe('on-site');
      expect(result.jobs[2].workmode).toBe('hybrid');
      expect(result.jobs[3].workmode).toBe('hybrid');
    });

    it('should handle empty jobs array', () => {
      const result = index.transformJobsForSOLR({ jobs: [] });
      expect(result.jobs).toEqual([]);
    });
  });

  describe('mapToJobModel', () => {
    it('should map raw job to job model format', () => {
      const rawJob = {
        url: 'https://www.principal33.com/job-offers/?personio_job_id=2510622',
        title: 'Data Engineer',
        location: ['Cluj-Napoca'],
        tags: ['sql', 'aws', 'python'],
        workmode: 'hybrid'
      };

      const COMPANY_NAME = 'PRINCIPAL33 S.R.L.';
      const COMPANY_CIF = '42574513';

      const result = index.mapToJobModel(rawJob, COMPANY_CIF, COMPANY_NAME);

      expect(result.url).toBe(rawJob.url);
      expect(result.title).toBe(rawJob.title);
      expect(result.company).toBe(COMPANY_NAME);
      expect(result.cif).toBe(COMPANY_CIF);
      expect(result.location).toEqual(rawJob.location);
      expect(result.tags).toEqual(rawJob.tags);
      expect(result.workmode).toBe(rawJob.workmode);
      expect(result.status).toBe('scraped');
      expect(result.date).toBeDefined();
    });

    it('should remove undefined fields', () => {
      const rawJob = {
        url: 'https://test.com/1',
        title: 'Job 1'
      };

      const result = index.mapToJobModel(rawJob, '42574513');

      expect(result.location).toBeUndefined();
      expect(result.tags).toBeUndefined();
      expect(result.workmode).toBeUndefined();
    });

    it('should handle missing title', () => {
      const rawJob = { url: 'https://test.com/1' };

      const result = index.mapToJobModel(rawJob, '42574513');

      expect(result.title).toBeUndefined();
      expect(result.url).toBe('https://test.com/1');
    });
  });

  describe('parsePersonioJobs', () => {
    it('should parse Personio API response format', () => {
      const personioData = [
        {
          id: 2510622,
          name: 'Data Engineer',
          office: 'Cluj-Napoca',
          offices: ['Cluj-Napoca'],
          schedule: 'Full-time',
          keywords: 'SQL,AWS,Python',
          employment_type: 'Permanent employee',
          seniority: 'Experienced',
          department: 'Aily',
          subcompany: 'Principal33 S.R.L.'
        }
      ];

      const result = index.parsePersonioJobs(personioData);

      expect(result.jobs).toHaveLength(1);
      expect(result.jobs[0].title).toBe('Data Engineer');
      expect(result.jobs[0].location).toEqual(['Cluj-Napoca']);
      expect(result.jobs[0].workmode).toBe('hybrid');
      expect(result.jobs[0].tags).toEqual(['sql', 'aws', 'python']);
    });

    it('should handle empty job list', () => {
      const result = index.parsePersonioJobs([]);
      expect(result.jobs).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle missing data gracefully', () => {
      const result = index.parsePersonioJobs(null);
      expect(result.jobs).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle multiple offices', () => {
      const personioData = [
        {
          id: 2594639,
          name: 'Project Manager',
          offices: ['Cluj-Napoca', 'Brasov', 'Valencia'],
          keywords: '',
          schedule: 'Full-time'
        }
      ];

      const result = index.parsePersonioJobs(personioData);

      expect(result.jobs[0].location).toEqual(['Cluj-Napoca', 'Brasov', 'Valencia']);
    });
  });
});