import React from "react";
import { Form, Modal, Row, Col, Input, message, Select } from "antd";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { AddMovie, UpdateMovie, DeleteMovie } from "../../apiCalls/movies";
import moment from "moment";

const MoviesForm = ({
  showMovieForm,
  setShowMovieForm,
  selectedMovie,
  setSelectedMovie,
  formType,
  getData,
}) => {
  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      "YYYY-MM-DD"
    );
  }

  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await AddMovie(values);
      } else {
        response = await UpdateMovie({
          ...values,
          movieId: selectedMovie._id,
        });
      }
      if (response.success) {
        getData();
        message.success(response.message);
        setShowMovieForm(false);
        setSelectedMovie(null);
        dispatch(HideLoading());
      } else {
        message.error(response.message);
        dispatch(HideLoading());
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={formType === "add" ? "ADD MOVIE" : "EDIT MOVIE"}
      open={showMovieForm}
      onCancel={() => {
        setShowMovieForm(false);
        setSelectedMovie(null);
      }}
      footer={null}
      width={800}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedMovie}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Movie Name" name="title">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Movie Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Movie Duration" name="duration">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Language" name="language">
              <Select placeholder="Select Language">
                <Select.Option value="Tamil">Tamil</Select.Option>
                <Select.Option value="English">English</Select.Option>
                <Select.Option value="Malayalam">Malayalam</Select.Option>
                <Select.Option value="Telugu">Telugu</Select.Option>
                <Select.Option value="Hindi">Hindi</Select.Option>
                <Select.Option value="Kannada">Kannada</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Movie Release Date" name="releaseDate">
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Genre" name="genre">
              <Select placeholder="Select Genre">
                <Select.Option value="Action">Action</Select.Option>
                <Select.Option value="Comedy">Comedy</Select.Option>
                <Select.Option value="Romance">Romance</Select.Option>
                <Select.Option value="Drama">Drama</Select.Option>
                <Select.Option value="Horror">Horror</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Poster URL" name="poster">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end gap-1">
          <Button
            title="Cancel"
            variant="outlined"
            type="button"
            onClick={() => {
              setShowMovieForm(false);
              setSelectedMovie(null);
            }}
          />
          <Button title="Save" type="submit" />
        </div>
      </Form>
    </Modal>
  );
};

export default MoviesForm;
