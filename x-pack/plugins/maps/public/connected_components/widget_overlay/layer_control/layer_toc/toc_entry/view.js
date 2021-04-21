/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import classNames from 'classnames';

import { EuiIcon, EuiButtonIcon, EuiConfirmModal } from '@elastic/eui';
import { TOCEntryActionsPopover } from './toc_entry_actions_popover';
import { i18n } from '@kbn/i18n';
import {
  getVisibilityToggleIcon,
  getVisibilityToggleLabel,
  EDIT_LAYER_LABEL,
  FIT_TO_DATA_LABEL,
} from './action_labels';

function escapeLayerName(name) {
  return name ? name.split(' ').join('_') : '';
}

export class TOCEntry extends React.Component {
  state = {
    displayName: null,
    hasLegendDetails: false,
    shouldShowModal: false,
    supportsFitToBounds: false,
  };

  componentDidMount() {
    this._isMounted = true;
    this._updateDisplayName();
    this._loadHasLegendDetails();
    this._loadSupportsFitToBounds();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    this._updateDisplayName();
    this._loadHasLegendDetails();
  }

  _toggleLayerDetailsVisibility = () => {
    if (this.props.isLegendDetailsOpen) {
      this.props.hideTOCDetails(this.props.layer.getId());
    } else {
      this.props.showTOCDetails(this.props.layer.getId());
    }
  };

  async _loadSupportsFitToBounds() {
    const supportsFitToBounds = await this.props.layer.supportsFitToBounds();
    if (this._isMounted) {
      this.setState({ supportsFitToBounds });
    }
  }

  async _loadHasLegendDetails() {
    const hasLegendDetails =
      (await this.props.layer.hasLegendDetails()) &&
      this.props.layer.isVisible() &&
      this.props.layer.showAtZoomLevel(this.props.zoom);
    if (this._isMounted && hasLegendDetails !== this.state.hasLegendDetails) {
      this.setState({ hasLegendDetails });
    }
  }

  async _updateDisplayName() {
    const label = await this.props.layer.getDisplayName();
    if (this._isMounted) {
      if (label !== this.state.displayName) {
        this.setState({
          displayName: label,
        });
      }
    }
  }

  _openLayerPanelWithCheck = () => {
    const { selectedLayer, hasDirtyStateSelector } = this.props;
    if (selectedLayer && selectedLayer.getId() === this.props.layer.getId()) {
      return;
    }

    if (hasDirtyStateSelector) {
      this.setState({
        shouldShowModal: true,
      });
      return;
    }

    this.props.openLayerPanel(this.props.layer.getId());
  };

  _fitToBounds = () => {
    this.props.fitToBounds(this.props.layer.getId());
  };

  _toggleVisible = () => {
    this.props.toggleVisible(this.props.layer.getId());
  };

  _renderCancelModal() {
    if (!this.state.shouldShowModal) {
      return null;
    }

    const closeModal = () => {
      this.setState({
        shouldShowModal: false,
      });
    };

    const openPanel = () => {
      closeModal();
      this.props.openLayerPanel(this.props.layer.getId());
    };

    return (
      <EuiConfirmModal
        title="Discard changes"
        onCancel={closeModal}
        onConfirm={openPanel}
        cancelButtonText="Do not proceed"
        confirmButtonText="Proceed and discard changes"
        buttonColor="danger"
        defaultFocusedButton="cancel"
      >
        <p>There are unsaved changes to your layer.</p>
        <p>Are you sure you want to proceed?</p>
      </EuiConfirmModal>
    );
  }

  _renderQuickActions() {
    const quickActions = [
      <EuiButtonIcon
        iconType={getVisibilityToggleIcon(this.props.layer.isVisible())}
        title={getVisibilityToggleLabel(this.props.layer.isVisible())}
        aria-label={getVisibilityToggleLabel(this.props.layer.isVisible())}
        onClick={this._toggleVisible}
      />,
    ];

    if (this.state.supportsFitToBounds) {
      quickActions.push(
        <EuiButtonIcon
          iconType="expand"
          title={FIT_TO_DATA_LABEL}
          aria-label={FIT_TO_DATA_LABEL}
          onClick={this._fitToBounds}
        />
      );
    }

    if (!this.props.isReadOnly) {
      quickActions.push(
        <EuiButtonIcon
          isDisabled={this.props.isEditButtonDisabled}
          iconType="pencil"
          aria-label={EDIT_LAYER_LABEL}
          title={EDIT_LAYER_LABEL}
          onClick={this._openLayerPanelWithCheck}
        />
      );
      quickActions.push(
        <EuiButtonIcon
          iconType="grab"
          title={i18n.translate('xpack.maps.layerControl.tocEntry.grabButtonTitle', {
            defaultMessage: 'Reorder layer',
          })}
          aria-label={i18n.translate('xpack.maps.layerControl.tocEntry.grabButtonAriaLabel', {
            defaultMessage: 'Reorder layer',
          })}
          className="mapTocEntry__grab"
          {...this.props.dragHandleProps}
        />
      );
    }

    return <div className="mapTocEntry__layerIcons">{quickActions}</div>;
  }

  _renderDetailsToggle() {
    if (!this.state.hasLegendDetails) {
      return null;
    }

    const { isLegendDetailsOpen } = this.props;
    return (
      <span className="mapTocEntry__detailsToggle">
        <button
          className="mapTocEntry__detailsToggleButton"
          aria-label={
            isLegendDetailsOpen
              ? i18n.translate('xpack.maps.layerControl.tocEntry.hideDetailsButtonAriaLabel', {
                  defaultMessage: 'Hide layer details',
                })
              : i18n.translate('xpack.maps.layerControl.tocEntry.showDetailsButtonAriaLabel', {
                  defaultMessage: 'Show layer details',
                })
          }
          title={
            isLegendDetailsOpen
              ? i18n.translate('xpack.maps.layerControl.tocEntry.hideDetailsButtonTitle', {
                  defaultMessage: 'Hide layer details',
                })
              : i18n.translate('xpack.maps.layerControl.tocEntry.showDetailsButtonTitle', {
                  defaultMessage: 'Show layer details',
                })
          }
          onClick={this._toggleLayerDetailsVisibility}
        >
          <EuiIcon
            className="eui-alignBaseline"
            type={isLegendDetailsOpen ? 'arrowUp' : 'arrowDown'}
            size="s"
          />
        </button>
      </span>
    );
  }

  _renderLayerHeader() {
    const { layer, zoom } = this.props;
    return (
      <div
        className={
          layer.isVisible() && layer.showAtZoomLevel(zoom) && !layer.hasErrors()
            ? 'mapTocEntry-visible'
            : 'mapTocEntry-notVisible'
        }
      >
        <TOCEntryActionsPopover
          layer={layer}
          displayName={this.state.displayName}
          escapedDisplayName={escapeLayerName(this.state.displayName)}
          editLayer={this._openLayerPanelWithCheck}
          isEditButtonDisabled={this.props.isEditButtonDisabled}
          supportsFitToBounds={this.state.supportsFitToBounds}
        />

        {this._renderQuickActions()}
      </div>
    );
  }

  _renderLegendDetails = () => {
    if (!this.props.isLegendDetailsOpen || !this.state.hasLegendDetails) {
      return null;
    }

    const tocDetails = this.props.layer.renderLegendDetails();
    if (!tocDetails) {
      return null;
    }

    return (
      <div
        className="mapTocEntry__layerDetails"
        data-test-subj={`mapLayerTOCDetails${escapeLayerName(this.state.displayName)}`}
      >
        {tocDetails}
      </div>
    );
  };

  render() {
    const classes = classNames('mapTocEntry', {
      'mapTocEntry-isDragging': this.props.isDragging,
      'mapTocEntry-isDraggingOver': this.props.isDraggingOver,
      'mapTocEntry-isSelected':
        this.props.layer.isPreviewLayer() ||
        (this.props.selectedLayer && this.props.selectedLayer.getId() === this.props.layer.getId()),
    });

    return (
      <div
        className={classes}
        id={this.props.layer.getId()}
        data-layerid={this.props.layer.getId()}
      >
        {this._renderLayerHeader()}

        {this._renderLegendDetails()}

        {this._renderDetailsToggle()}

        {this._renderCancelModal()}
      </div>
    );
  }
}
