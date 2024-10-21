import { axiosInstance } from '../axios-instance';
import { SuccessResponse } from '../response';
import InvestmentDto from './dto/investment';

export default class InvestmentService {
  async getInvestmentsList(
    pageNumber: number,
    pageSize: number,
  ): Promise<SuccessResponse<InvestmentDto[]>> {
    const response = await axiosInstance.get<SuccessResponse<InvestmentDto[]>>(
      '/investment',
      {
        params: {
          page: pageNumber,
          pageSize,
        },
      },
    );
    return response.data;
  }
}
