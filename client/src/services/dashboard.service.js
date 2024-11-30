import createService from './api.service'
import FileSaver from 'file-saver'
import { createQueryString } from '@/untils'
class dashboardService {
    constructor(baseUrl = '/api/dashboard') {
        this.api = createService(baseUrl)
    }

    async getStatistical(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/statistical${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async getChart(token, option) {
        let parameter = createQueryString(option)
        return (await this.api.get(`/chart${parameter}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
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