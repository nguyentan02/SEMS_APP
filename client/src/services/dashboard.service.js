import createService from './api.service'
import FileSaver from 'file-saver'
class dashboardService {
    constructor(baseUrl = '/api/dashboard') {
        this.api = createService(baseUrl)
    }

  
    async downloadExcelDevice(token) {
        const response = (await this.api.get('export-device', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        })).data
        const file = new Blob([response], { type: 'application/vnd.ms-excel' })
        FileSaver.saveAs(file, `Danh sách thiết bị.xlsx`);
    }
}

export default new dashboardService()