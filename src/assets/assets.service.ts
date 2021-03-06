import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';

@Injectable()
export class AssetsService {

	findAvatar(imageName: string, res: any): Observable<Object> {
		return of(res.sendFile(join(process.cwd(), `uploads/avatars/${imageName}`)));
	}

	findCover(imageName: string, res: any): Observable<Object> {
		return of(res.sendFile(join(process.cwd(), `uploads/covers/${imageName}`)));
	}

	findResource(imageName: string, res: any): Observable<Object> {
		return of(res.sendFile(join(process.cwd(), `uploads/resources/${imageName}`)));
	}
	
}
