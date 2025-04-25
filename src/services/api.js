import axios from 'axios';

const mockServices = [
  {
    id: '1',
    name: 'Website Development',
    description: 'Full website development including frontend and backend',
    category: 'Web Development',
    status: 'active',
    price: 1500,
    createdAt: '2025-04-15T12:00:00Z'
  },
  {
    id: '2',
    name: 'Mobile App Design',
    description: 'UI/UX design for iOS and Android applications',
    category: 'UI/UX Design',
    status: 'pending',
    price: 2000,
    createdAt: '2025-04-10T10:30:00Z'
  },
  {
    id: '3',
    name: 'SEO Optimization',
    description: 'Improve your website ranking on search engines',
    category: 'Marketing',
    status: 'completed',
    price: 800,
    createdAt: '2025-04-05T14:45:00Z'
  }
];

const api = axios.create({
  baseURL: 'https://api.example.com',
});

api.interceptors.request.use(
  async (config) => {
    const mockResponses = {
      'POST /login': () => {
        return [
          200, 
          { 
            user: { id: '1', name: 'Admin User', email: 'admin@example.com' },
            token: 'fake-jwt-token'
          }
        ];
      },
      'GET /services': () => {
        return [200, [...mockServices]];
      },
      'POST /services': (data) => {
        const newService = {
          id: (mockServices.length + 1).toString(),
          ...data,
          createdAt: new Date().toISOString()
        };
        mockServices.push(newService);
        return [200, newService];
      }
    };
    await new Promise(resolve => setTimeout(resolve, 800));

    const path = `${config.method.toUpperCase()} ${config.url}`;
    const mockResponse = mockResponses[path];

    if (mockResponse) {
      let responseData;
      if (config.method.toUpperCase() === 'POST') {
        responseData = mockResponse(config.data);
      } else {
        responseData = mockResponse();
      }

      if (responseData) {
        const [status, data] = responseData;
        return Promise.reject({
          response: {
            status,
            data
          },
          isAxiosMockResponse: true
        });
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.isAxiosMockResponse) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default api;