import PageHeader from "./PageHeader";
import PageTitleWrapper from "../../../../components/PageTitleWrapper";
import { Box, Grid, Container } from "@mui/material";

import TableData from "./TableData";

function Location() {
  return (
    <Box mb={20}>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <TableData />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Location;
