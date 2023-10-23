import ErrorService from '@services/errorService';

const index = async (req, res) => {
  const file = 'RWC-2023_Calendrier_FRE.pdf';

  try {
    const downloadLink = `./${process.env.DOWNLOAD_DIR}/${file}`;

    res.download(downloadLink);
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export default index;
