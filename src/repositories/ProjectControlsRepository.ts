import { ProjectControlsRecord } from '../domain/project-controls/ProjectControlsRecord';
import { Currency } from '../enums/Currency';
import { RecordStatus } from '../enums/RecordStatus';

export class ProjectControlsRepository {
  private apiEndpoint = '/api/project-controls/records';

  /**
   * Translates active site Project Controls records from a PostgreSQL SQLAlchemy relational table source.
   */
  public async getAll(): Promise<ProjectControlsRecord[]> {
    try {
      // Direct REST API fetch implementation for FastAPI / PostgreSQL
      // const response = await fetch(this.apiEndpoint);
      // const data = await response.json();
    } catch (error) {
      console.error('Error fetching Project Controls records from PostgreSQL:', error);
    }
    return [];
  }

  /**
   * Persists active site submittal logs directly into PostgreSQL.
   */
  public async save(record: ProjectControlsRecord): Promise<boolean> {
    try {
      // PUT/POST request to corporate FastAPI endpoint
    } catch (error) {
      console.error('Error preserving Project Controls record:', error);
    }
    return false;
  }
}
