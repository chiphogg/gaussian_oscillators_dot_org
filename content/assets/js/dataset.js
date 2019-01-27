// A library to facilitate animation datasets.
//
// The "dataset" interface has two members:
// - `data`
//    A dictionary containing the data.
// - `advance()`
//    A function to get the next version of the dataset.

// A linearly spaced range of numbers.
function xRange(first, last, num_pts) {
  return Array.from({length : num_pts},
                    (_, i) => first + (last - first) * i / (num_pts - 1));
  }

// A dataset that does not change.
function staticDataset(data) {
  return {
    data : Object.assign({}, data),
    advance : () => {},
  };
  }

// An aggregate dataset made of other individual datasets.
function combine(datasets) {
  var combined_dataset =
      datasets.reduce((result, d) => Object.assign(result, d.data), {});

  return {
    data : combined_dataset,
    advance : () => datasets.forEach(d => d.advance()),
  };
  }

// Add synthetic data to a dataset.
function augment(dataset, augmentation) {
  // Make a shallow copy of the references: we want to stay up to date on
  // changes in the data, but we don't want to change the entries in the
  // "parent" dataset.
  var data = Object.assign({}, dataset.data)
  augmentation.update_derived_data(data)

      // Advance the underlying data, and recompute the augmented data.
      function
      advance() {
        dataset.advance();
        augmentation.update_derived_data(data)
      }

  return {
    data : data,
    advance : advance,
  };
  }

// Augment dataset by applying a map to some existing data.
function mapAugmentations(augmentations) {
  // A utility to find the shortest data trace that's an input to the function.
  //
  // Could easily be removed from this class.
  function _shortest_length(keys, dict) {
    return Math.min(...keys.map(k => dict[k].length));
    }

  // Apply the map to every affected element.
  function _apply_augmentation(label, aug, data) {
    // Ensure the array exists.
    if (!data[label]) {
      data[label] = [];
      }

    // Update the data in the array.
    for (var i = 0, i_stop = _shortest_length(aug.vars, data); i < i_stop;
         ++i) {
      data[label][i] = aug.xform(aug.vars.map(k => data[k][i]))
    }
    }

  // Apply every augmentation.
  function update_derived_data(data) {
    Object.entries(augmentations)
        .forEach(([ label, aug ]) => _apply_augmentation(label, aug, data));
    }

  return {
    update_derived_data : update_derived_data,
  };
}
