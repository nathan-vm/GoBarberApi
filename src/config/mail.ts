interface IMailCofig {
  driver: 'ethereal' | 'ses'

  defaults: {
    from: {
      email: string
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'contato@nathanvm.com.br',
      name: 'Nathan - Web Developer',
    },
  },
} as IMailCofig
